export default function ServiceCard({ service }) {
  // Defensive check in case service is undefined
  if (!service) return null;

  return (
    <div className="bg-white border border-brand-primary/10 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center">
      {service.image ? (
         <img src={service.image} alt={service.name || "Service"} className="w-full h-40 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-40 bg-brand-primary/10 rounded-md mb-4 flex items-center justify-center text-brand-primary">
          <i className="fa-solid fa-image text-3xl"></i>
        </div>
      )}
     
      <h3 className="text-lg font-bold text-brand-dark mb-2">{service.name || "Service Name"}</h3>
      <p className="text-gray-600 text-sm mb-4 text-center">{service.description || "No description available."}</p>
      <div className="text-brand-primary font-bold mb-4">{service.price || "Price TBD"}</div>
      
      <button className="w-full py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
        Request Service
      </button>
    </div>
  );
}