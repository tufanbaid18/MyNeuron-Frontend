import { Link } from "@tanstack/react-router";
import { useGatcSpeakers } from "../../hooks/gatc/useGatc";
import { getAvatarByName } from "../../utils/avatar.utils";

const GatcSpeakers = () => {
  const { data: speakers, isLoading, error } = useGatcSpeakers();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Failed to load speakers.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-10 text-2xl font-bold text-gray-400">Speakers</h1>
      
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {speakers?.map((speaker) => (
          <Link
            key={speaker.id}
            to={`/gatc/speakers/${speaker.id}`}
            className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
          >
            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-slate-100 shadow-sm transition-shadow group-hover:shadow-md">
              <img
                src={speaker.profile_image || getAvatarByName({ firstName: speaker.first_name, lastName: speaker.last_name })}
                alt={speaker.first_name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <h3 className="text-lg font-medium text-slate-800 transition-colors group-hover:text-emerald-600">
              {speaker.first_name} {speaker.middle_name ? `${speaker.middle_name} ` : ""}{speaker.last_name}
            </h3>
            
            <p className="text-sm font-medium text-slate-400">
              {speaker.role}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GatcSpeakers;
