import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext'; // Ensure this path is correct for your structure

// Component to auto-center map when products change
function MapUpdater({ products }) {
    const map = useMap();
    
    React.useEffect(() => {
        if (products.length > 0) {
            const validCoords = products
                .filter(p => p.geoLocation?.coordinates?.length === 2 && p.geoLocation.coordinates[0] !== 0)
                .map(p => [p.geoLocation.coordinates[1], p.geoLocation.coordinates[0]]);
            
            if (validCoords.length > 0) {
                const bounds = L.latLngBounds(validCoords);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        }
    }, [products, map]);
    
    return null;
}

// 🔥 Updated: Shows Product Name instead of Price
const createNameMarker = (name) => {
    // Truncate long names so the map pin doesn't become massive
    const displayName = name.length > 15 ? name.substring(0, 15) + '...' : name;

    return L.divIcon({
        className: 'custom-marker', 
        html: `
            <div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-3 py-1.5 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-zinc-200 dark:border-zinc-700 font-bold text-xs whitespace-nowrap transition-transform hover:scale-110 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 hover:border-transparent flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 dark:text-blue-400"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                ${displayName}
            </div>
        `,
        iconSize: [null, null], 
        iconAnchor: [40, 15], // Centers the pin over the coordinate
        popupAnchor: [0, -20]
    });
};

const ProductMap = ({ products }) => {
    const { isDarkMode } = useTheme();
    const defaultCenter = [19.0760, 72.8777]; // Mumbai

    // Dynamic Map Tiles based on Light/Dark Mode
    const tileUrl = isDarkMode 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Sleek Dark Map
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"; // Clean Light Map

    return (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 relative z-0 group">
            
            {/* Inline CSS to override ugly default Leaflet Popup styles */}
            <style>{`
                .leaflet-popup-content-wrapper { 
                    padding: 0; 
                    overflow: hidden; 
                    border-radius: 1rem; 
                    background: transparent; 
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                }
                .leaflet-popup-content { margin: 0; width: 260px !important; }
                .leaflet-popup-tip-container { display: none; } /* Hides the bottom triangle */
                a.leaflet-popup-close-button {
                    color: white !important;
                    background: rgba(0,0,0,0.5) !important;
                    border-radius: 100%;
                    width: 24px !important;
                    height: 24px !important;
                    text-align: center;
                    line-height: 24px !important;
                    top: 8px !important;
                    right: 8px !important;
                    padding: 0 !important;
                    font-weight: normal !important;
                    transition: all 0.2s;
                }
                a.leaflet-popup-close-button:hover { background: rgba(0,0,0,0.8) !important; }
            `}</style>

            <MapContainer 
                center={defaultCenter} 
                zoom={11} 
                scrollWheelZoom={true} 
                className="w-full h-full z-0"
            >
                <TileLayer
                    key={tileUrl} // Forces re-render when theme changes
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={tileUrl}
                />
                
                <MapUpdater products={products} />

                {products.map((product) => {
                    if (!product.geoLocation || !product.geoLocation.coordinates || product.geoLocation.coordinates[0] === 0) {
                        return null; 
                    }

                    const position = [product.geoLocation.coordinates[1], product.geoLocation.coordinates[0]];

                    return (
                        <Marker 
                            key={product._id} 
                            position={position}
                            icon={createNameMarker(product.name)} // 🔥 Using Name Marker
                        >
                            <Popup>
                                {/* Custom Styled Popup Content */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col h-full rounded-2xl overflow-hidden">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        <img 
                                            src={product.productImages?.[0] || product.productImage || '/default-placeholder.png'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-zinc-900 dark:text-zinc-50 shadow-sm">
                                            ₹{product.pricePerDay}/d
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-1">
                                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 truncate">{product.name}</h3>
                                        
                                        <div className="flex items-center text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 shrink-0" />
                                            <span className="truncate">{product.location}</span>
                                        </div>

                                        <Link 
                                            to={`/product/${product._id}`}
                                            className="mt-4 block w-full text-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-colors"
                                        >
                                            View Listing
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