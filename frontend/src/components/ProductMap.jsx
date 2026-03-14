import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Star, MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to auto-center map when products change
function MapUpdater({ products }) {
    const map = useMap();
    
    React.useEffect(() => {
        if (products.length > 0) {
            // Find all valid coordinates
            const validCoords = products
                .filter(p => p.geoLocation?.coordinates?.length === 2 && p.geoLocation.coordinates[0] !== 0)
                .map(p => [p.geoLocation.coordinates[1], p.geoLocation.coordinates[0]]); // Leaflet uses [lat, lng]
            
            if (validCoords.length > 0) {
                // Create a bounds object and fit map to it
                const bounds = L.latLngBounds(validCoords);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        }
    }, [products, map]);
    
    return null;
}

const ProductMap = ({ products }) => {
    // Default center (Mumbai)
    const defaultCenter = [19.0760, 72.8777];

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 z-0 relative">
            <MapContainer 
                center={defaultCenter} 
                zoom={11} 
                scrollWheelZoom={true} 
                className="w-full h-full z-0"
            >
                {/* Clean, modern map tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                <MapUpdater products={products} />

                {products.map((product) => {
                    // Make sure the product actually has valid coordinates
                    if (!product.geoLocation || !product.geoLocation.coordinates || product.geoLocation.coordinates[0] === 0) {
                        return null; 
                    }

                    // Backend stores [Longitude, Latitude], Leaflet needs [Latitude, Longitude]
                    const position = [
                        product.geoLocation.coordinates[1], 
                        product.geoLocation.coordinates[0]
                    ];

                    return (
                        <Marker key={product._id} position={position}>
                            <Popup className="custom-popup">
                                <div className="w-48">
                                    <div className="h-32 w-full rounded-t-lg overflow-hidden mb-2">
                                        <img 
                                            src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="px-1 pb-1">
                                        <h3 className="font-bold text-sm text-zinc-900 truncate">{product.name}</h3>
                                        <p className="text-blue-600 font-bold text-sm mt-1">₹{product.pricePerDay} <span className="text-xs text-zinc-500 font-normal">/ day</span></p>
                                        
                                        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500 truncate">
                                            <MapPin className="w-3 h-3 shrink-0" />
                                            <span className="truncate">{product.location}</span>
                                        </div>

                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="mt-3 block w-full text-center bg-zinc-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default ProductMap;