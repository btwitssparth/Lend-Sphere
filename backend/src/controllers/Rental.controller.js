import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rental } from "../models/Rental.model.js";
import { Product } from "../models/Product.model.js";

// 1. Rent a Product 
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

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (!product.isAvailable) throw new ApiError(400, "Product is currently not available");
    if (product.owner.toString() === req.user._id.toString()) throw new ApiError(400, "You cannot rent your own product");

    // 🔥 INVENTORY CHECK LOGIC
    // Find all rentals that overlap with the requested dates
    const conflictingRentals = await Rental.find({
        product: productId,
        status: { $in: ['Pending', 'Approved', 'Active'] },
        $or: [
            { startDate: { $lte: start }, endDate: { $gte: start } }, // Case 1: Existing rental covers start date
            { startDate: { $lte: end }, endDate: { $gte: end } },     // Case 2: Existing rental covers end date
            { startDate: { $gte: start }, endDate: { $lte: end } }    // Case 3: Existing rental is inside requested dates
        ]
    });

    // 🔥 Check if the overlap count meets or exceeds the inventory limit
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

    return res.status(201).json(new ApiResponse(201, rental, "Rental request sent successfully"));
});

// 2. Get Unavailable Dates (Still works, but stricter)
// ... existing imports ...

// 2. Get Unavailable Dates (SMART CALENDAR LOGIC)
const getUnavailableDates = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    const quantity = product.quantity || 1; // Get total inventory

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all future active rentals for this product
    const rentals = await Rental.find({
        product: productId,
        endDate: { $gte: today }, 
        status: { $in: ['Pending', 'Approved', 'Active'] } 
    });

    if (rentals.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "All dates available"));
    }

    // FAST PATH: If inventory is 1, just return the rental dates
    if (quantity === 1) {
        const simpleDates = rentals.map(r => ({
            startDate: r.startDate,
            endDate: r.endDate
        }));
        return res.status(200).json(new ApiResponse(200, simpleDates, "Unavailable dates fetched"));
    }

    // SMART PATH: If inventory > 1, calculate strictly overlapping days
    const fullyBookedDates = [];
    
    // Find the absolute furthest end date among all rentals
    const maxDate = new Date(Math.max(...rentals.map(r => new Date(r.endDate).getTime())));
    maxDate.setHours(0, 0, 0, 0);

    let currentUnavailableStart = null;
    let currentDate = new Date(today);

    // Go one day past the max date to ensure we close out the final interval loop
    const loopEnd = new Date(maxDate);
    loopEnd.setDate(loopEnd.getDate() + 1);

    // Loop through every single day from today until the furthest booked date
    while (currentDate <= loopEnd) {
        const currentTime = currentDate.getTime();
        
        // Count how many rentals overlap on this specific day
        const overlappingCount = rentals.filter(r => {
            const s = new Date(r.startDate).setHours(0, 0, 0, 0);
            const e = new Date(r.endDate).setHours(0, 0, 0, 0);
            return currentTime >= s && currentTime <= e;
        }).length;

        // If bookings hit max inventory, this day is fully booked
        if (overlappingCount >= quantity) {
            if (!currentUnavailableStart) {
                currentUnavailableStart = new Date(currentDate); // Start an interval
            }
        } else {
            // If the day is NOT fully booked, but we were tracking an interval, close it
            if (currentUnavailableStart) {
                const intervalEnd = new Date(currentDate);
                intervalEnd.setDate(intervalEnd.getDate() - 1); // Yesterday was the last fully booked day
                
                fullyBookedDates.push({
                    startDate: currentUnavailableStart,
                    endDate: intervalEnd
                });
                currentUnavailableStart = null;
            }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0); // Re-normalize to midnight safely
    }

    return res.status(200).json(new ApiResponse(200, fullyBookedDates, "Smart unavailable dates calculated"));
});



const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ renter: req.user._id })
        .populate("product", "name productImage pricePerDay productImages")
        .populate("review")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, rentals, "My rentals fetched Successfully"));
});

const getLenderRentals = asyncHandler(async(req, res)=>{
    const rentals = await Rental.find()
        .populate({
            path: "product",
            match: { owner: req.user._id },
            select: "name pricePerDay productImage productImages"
        })
        .populate("renter", "name email identityProof")
        .populate("review")
        .sort({ createdAt: -1 });

    const myLendingRequests = rentals.filter(rental => rental.product !== null);

    return res.status(200).json(new ApiResponse(200, myLendingRequests, "Incoming rental requests fetched"));
});

const updateRentalStatus = asyncHandler(async(req, res)=>{
    const { rentalId, status } = req.body;
    const rental = await Rental.findById(rentalId).populate("product");
    
    if(!rental) throw new ApiError(404, "Rental request not found");
    if(rental.product.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized");

    rental.status = status;
    await rental.save();

    return res.status(200).json(new ApiResponse(200, rental, `Rental status updated to ${status}`));
});

export { rentItem, getUnavailableDates, getMyRentals, getLenderRentals, updateRentalStatus };