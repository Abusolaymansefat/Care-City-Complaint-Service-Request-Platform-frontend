
import Link from "next/link";
import { MapPin, ExternalLink } from "lucide-react";

export default function GoogleMapSection() {
  const mapLocation = "Dhaka, Bangladesh";

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="font-semibold text-blue-600">
            FIND OUR CITY
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Explore Your City
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Find your location and stay connected with
            city services through CityCare.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10">
                <MapPin size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  CityCare Service Area
                </h3>
                <p className="text-sm text-slate-500">
                  {mapLocation}
                </p>
              </div>
            </div>

            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Open Google Maps
              <ExternalLink size={16} />
            </Link>
          </div>

          <div className="h-[350px] w-full md:h-[450px]">
            <iframe
              title="CityCare Google Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
