import { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EventsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const events = [
    {
      title: 'Trail des Anglais',
      date: '22 février 2026',
      description: 'Une randonnée exceptionnelle dans un cadre magnifique',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: '🎯 Événement du mois'
    },
    {
      title: 'Dry January',
      date: '08-10 janvier 2026',
      description: 'Tour de l\'île à vélo en 3 jours',
      gradient: 'from-purple-500 via-indigo-500 to-blue-500',
      badge: '🚴 Sortie Vélo'
    },
    {
      title: 'Assemblée Générale 2026',
      date: '9 mai 2026',
      description: 'Rendez-vous annuel de tous les adhérents',
      gradient: 'from-teal-500 via-green-500 to-emerald-500',
      badge: '🏛️ Assemblée'
    },
    {
      title: '20ème Anniversaire',
      date: '14 juillet 2026',
      description: '20 ans des Maillons à La Source',
      gradient: 'from-red-500 via-orange-500 to-amber-500',
      badge: '🎉 Anniversaire'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentEvent = events[currentIndex];

  return (
    <div className={`relative w-full h-96 bg-gradient-to-r ${currentEvent.gradient} overflow-hidden rounded-2xl shadow-2xl mb-8`}>
      <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/30">
        <div className="text-center text-white max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Calendar className="w-4 h-4" />
            {currentEvent.badge}
          </div>
          <h3 className="text-4xl md:text-5xl font-bold">{currentEvent.title}</h3>
          <div className="flex items-center justify-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <p>{currentEvent.date}</p>
          </div>
          <p className="text-xl">{currentEvent.description}</p>
          <Button className="bg-white text-primary hover:bg-gray-100 mt-4">
            S'inscrire
          </Button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsCarousel;
