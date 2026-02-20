import { Music } from 'lucide-react';

const MusicBanner = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-12 my-8 rounded-2xl shadow-xl">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="w-8 h-8 animate-pulse" />
          <h3 className="text-3xl font-bold">Notre Playlist</h3>
        </div>
        <p className="text-lg mb-6 opacity-90">
          Découvrez la musique qui rythme nos événements
        </p>
        <div className="max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"
            title="Playlist Les Maillons"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicBanner;
