import { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Business, User } from './types';
import { storageService } from './services/storage';
import { searchService } from './services/search';
import { SearchBar } from './components/SearchBar';
import { PromotedCarousel } from './components/PromotedCarousel';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetail } from './components/BusinessDetail';
import { LoginModal } from './components/LoginModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    storageService.initializeSampleData();
    const loadedBusinesses = storageService.getBusinesses();
    setBusinesses(loadedBusinesses);
    setFilteredBusinesses(searchService.sortByPromotion(loadedBusinesses));

    const user = storageService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const results = searchService.searchBusinesses(searchQuery, businesses);
    setFilteredBusinesses(results);
  }, [searchQuery, businesses]);

  const groupedBusinesses = searchService.groupByPromotionTier(filteredBusinesses);

  const handleLogin = (user: User) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleAddReview = (rating: number, comment: string) => {
    if (!currentUser || !selectedBusiness) return;

    const review = {
      id: Date.now().toString(),
      businessId: selectedBusiness.id,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    storageService.addReview(review);

    const updatedBusinesses = storageService.getBusinesses();
    setBusinesses(updatedBusinesses);

    const updatedBusiness = updatedBusinesses.find(b => b.id === selectedBusiness.id);
    if (updatedBusiness) {
      setSelectedBusiness(updatedBusiness);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            BuscaNegocio
          </h1>

          <div>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Descubre los mejores lugares
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Restaurantes, entretenimiento, tiendas y más
          </p>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="space-y-8">
          {groupedBusinesses.premium.length > 0 && (
            <PromotedCarousel
              businesses={groupedBusinesses.premium}
              title="⭐ Destacados Premium"
              onBusinessClick={setSelectedBusiness}
            />
          )}

          {groupedBusinesses.gold.length > 0 && (
            <PromotedCarousel
              businesses={groupedBusinesses.gold}
              title="🏆 Promocionados Gold"
              onBusinessClick={setSelectedBusiness}
            />
          )}

          {groupedBusinesses.silver.length > 0 && (
            <PromotedCarousel
              businesses={groupedBusinesses.silver}
              title="✨ Promocionados Silver"
              onBusinessClick={setSelectedBusiness}
            />
          )}

          {groupedBusinesses.regular.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Todos los resultados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBusinesses.regular.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onClick={() => setSelectedBusiness(business)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No se encontraron resultados para "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedBusiness && (
        <BusinessDetail
          business={selectedBusiness}
          reviews={storageService.getReviewsByBusiness(selectedBusiness.id)}
          currentUser={currentUser}
          onClose={() => setSelectedBusiness(null)}
          onAddReview={handleAddReview}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
