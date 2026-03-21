import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rental } from "../models/Rental.model.js";
import { Product } from "../models/Product.model.js";
import { sendEmail } from "../utils/sendEmail.js";

// 1. Rent a Product (Triggers Email to Lender)
const rentItem = asyncHandler(async (req, res) => {
    const { productId, startDate, endDate, renterAddress } = req.body;

    if (!productId || !startDate || !endDate || !renterAddress) {
        throw new ApiError(400, "All fields, including your address, are required");
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) throw new ApiError(400, "Start date cannot be in the past");
    if (end <= start) throw new ApiError(400, "End date must be after start date");

    const product = await Product.findById(productId).populate('owner');
    if (!product) throw new ApiError(404, "Product not found");
    if (!product.isAvailable) throw new ApiError(400, "Product is currently not available");
    if (product.owner._id.toString() === req.user._id.toString()) throw new ApiError(400, "You cannot rent your own product");

    const conflictingRentals = await Rental.find({
        product: productId,
        status: { $in: ['Pending', 'Approved', 'Active'] },
        $or: [
            { startDate: { $lte: start }, endDate: { $gte: start } },
            { startDate: { $lte: end }, endDate: { $gte: end } },
            { startDate: { $gte: start }, endDate: { $lte: end } }
        ]
    });

    const totalInventory = product.quantity || 1; 
    if (conflictingRentals.length >= totalInventory) {
        throw new ApiError(409, `All ${totalInventory} units of this item are booked for these dates.`);
    }

    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalDays = days === 0 ? 1 : days; 
    const totalPrice = totalDays * product.pricePerDay;

    const rental = await Rental.create({
        renter: req.user._id,
        renterAddress,
        product: productId,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "Pending"
    });

    // 📧 EMAIL TRIGGER: Notify Lender of new request
    const lenderEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #0ea5e9; margin-bottom: 20px;">New Rental Request! 📦</h2>
            <p style="color: #374151; font-size: 16px;">
                Hi <strong>${product.owner.name.split(' ')[0]}</strong>, someone wants to rent your <strong>${product.name}</strong>.
            </p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0;"><strong>Renter:</strong> ${req.user.name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Dates:</strong> ${start.toLocaleDateString()} to ${end.toLocaleDateString()}</p>
                <p style="margin: 0;"><strong>Total Earnings:</strong> ₹${totalPrice}</p>
            </div>
            <p style="color: #374151; font-size: 16px;">Please log in to your Lend-Sphere dashboard to approve or decline this request.</p>
        </div>
    `;

    // Fire and forget (don't await so it doesn't slow down the user experience)
    sendEmail({
        email: product.owner.email, 
        subject: "Action Required: New Rental Request 🚀",
        html: lenderEmailHtml
    });

    return res.status(201).json(new ApiResponse(201, rental, "Rental request sent successfully"));
});

// 2. Get Unavailable Dates
const getUnavailableDates = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) throw new ApiError(400, "Product ID is required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    const quantity = product.quantity || 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rentals = await Rental.find({
        product: productId,
        endDate: { $gte: today }, 
        status: { $in: ['Pending', 'Approved', 'Active'] } 
    });

    if (rentals.length === 0) return res.status(200).json(new ApiResponse(200, [], "All dates available"));

    if (quantity === 1) {
        const simpleDates = rentals.map(r => ({ startDate: r.startDate, endDate: r.endDate }));
        return res.status(200).json(new ApiResponse(200, simpleDates, "Unavailable dates fetched"));
    }

    const fullyBookedDates = [];
    const maxDate = new Date(Math.max(...rentals.map(r => new Date(r.endDate).getTime())));
    maxDate.setHours(0, 0, 0, 0);

    let currentUnavailableStart = null;
    let currentDate = new Date(today);
    const loopEnd = new Date(maxDate);
    loopEnd.setDate(loopEnd.getDate() + 1);

    while (currentDate <= loopEnd) {
        const currentTime = currentDate.getTime();
        const overlappingCount = rentals.filter(r => {
            const s = new Date(r.startDate).setHours(0, 0, 0, 0);
            const e = new Date(r.endDate).setHours(0, 0, 0, 0);
            return currentTime >= s && currentTime <= e;
        }).length;

        if (overlappingCount >= quantity) {
            if (!currentUnavailableStart) currentUnavailableStart = new Date(currentDate);
        } else {
            if (currentUnavailableStart) {
                const intervalEnd = new Date(currentDate);
                intervalEnd.setDate(intervalEnd.getDate() - 1);
                fullyBookedDates.push({ startDate: currentUnavailableStart, endDate: intervalEnd });
                currentUnavailableStart = null;
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.status(200).json(new ApiResponse(200, fullyBookedDates, "Unavailable dates fetched"));
});

// 3. Get My Rentals (Renter side)
const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ renter: req.user._id })
        .populate('product')
        .populate({ path: 'product', populate: { path: 'owner', select: 'name email phone' } })
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, rentals, "Rentals fetched successfully"));
});

// 4. Get Lender Requests (Lender side)
const getLenderRentals = asyncHandler(async (req, res) => {
    const myProducts = await Product.find({ owner: req.user._id }).select('_id');
    const productIds = myProducts.map(p => p._id);

    const rentals = await Rental.find({ product: { $in: productIds } })
        .populate('product')
        .populate('renter', 'name email phone')
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, rentals, "Lender requests fetched successfully"));
});

// 5. Update Rental Status (Triggers Email to Renter)
// 5. Update Rental Status (Triggers Email to Renter)
const updateRentalStatus = asyncHandler(async (req, res) => {
    const { rentalId, status } = req.body;
    
    if (!rentalId || !status) throw new ApiError(400, "Rental ID and status are required");

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Active', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status update");

    const rental = await Rental.findById(rentalId)
        .populate('product')
        .populate('renter', 'name email');
        
    if (!rental) throw new ApiError(404, "Rental request not found");

    if (rental.product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this rental");
    }

    rental.status = status;
    await rental.save();

    // 📧 EMAIL TRIGGER: Notify Renter if Approved or Rejected
    if (status === 'Approved' || status === 'Rejected') {
        const statusColor = status === 'Approved' ? '#10b981' : '#ef4444'; // Green or Red
        
        let paymentBreakdownHtml = '';
        if (status === 'Approved') {
            // Calculate Total Amount
            const securityDeposit = rental.product.securityDeposit || 0;
            const rentAmount = rental.totalPrice || 0;
            const totalAmount = rentAmount + securityDeposit;

            paymentBreakdownHtml = `
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
                    <h3 style="margin-top: 0; color: #0ea5e9; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Payment Breakdown</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #475569; font-size: 15px;">Rental Amount:</span>
                        <strong style="color: #1e293b; font-size: 15px;">₹${rentAmount}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #475569; font-size: 15px;">Security Deposit <span style="font-size: 12px; color: #94a3b8;">(Refundable)</span>:</span>
                        <strong style="color: #1e293b; font-size: 15px;">₹${securityDeposit}</strong>
                    </div>
                    <hr style="border: none; border-top: 1px dashed #cbd5e1; margin: 15px 0;" />
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #0f172a; font-size: 18px; font-weight: bold;">Total to Pay:</span>
                        <strong style="color: #0ea5e9; font-size: 20px;">₹${totalAmount}</strong>
                    </div>
                </div>
                <p style="color: #374151; font-size: 16px;">Please log in to your dashboard to complete the secure payment and view pickup instructions.</p>
            `;
        } else {
             paymentBreakdownHtml = `<p style="color: #374151; font-size: 16px;">Unfortunately, the lender cannot accommodate this request at this time. Don't worry, you haven't been charged!</p>`;
        }

        const renterEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                <h2 style="color: ${statusColor}; margin-bottom: 20px; text-align: center;">Rental Request ${status}!</h2>
                <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                    Hi <strong>${rental.renter.name.split(' ')[0]}</strong>, your request to rent <strong>${rental.product.name}</strong> has been <strong>${status.toLowerCase()}</strong> by the owner.
                </p>
                ${paymentBreakdownHtml}
            </div>
        `;

        sendEmail({
            email: rental.renter.email,
            subject: `Update on your rental request for ${rental.product.name}`,
            html: renterEmailHtml
        });
    }

    return res.status(200).json(new ApiResponse(200, rental, `Rental status updated to ${status}`));
});

export { rentItem, getUnavailableDates, getMyRentals, getLenderRentals, updateRentalStatus };