import { useState, useEffect } from 'react';
import { LogIn, User as UserIcon, Package as PackageIcon } from 'lucide-react';
import { Business, User } from './types';
import { storageService } from './services/storage';
import { searchService } from './services/search';
import { SearchBar } from './components/SearchBar';
import { PromotedCarousel } from './components/PromotedCarousel';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetail } from './components/BusinessDetail';
import { LoginModal } from './components/LoginModal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { DeliveryService } from './components/DeliveryService';
import { UserSettings } from './components/UserSettings';
import { EventManager } from './components/EventManager';
import { UpgradeModal } from './components/UpgradeModal';
import { UserMenu } from './components/UserMenu';

type ViewMode = 'directory' | 'business-dashboard' | 'delivery' | 'events';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
    const existingUsers = storageService.getUsers();
    const existingUser = existingUsers.find(u => u.email === user.email);

    if (!existingUser) {
      const newUser = {
        ...user,
        createdAt: new Date().toISOString(),
      };
      storageService.addUser(newUser);
      storageService.setCurrentUser(newUser);
      setCurrentUser(newUser);
    } else {
      storageService.setCurrentUser(existingUser);
      setCurrentUser(existingUser);
    }
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

  const handleUpgrade = () => {
    setShowSettings(false);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = (businessData: Omit<Business, 'id' | 'rating' | 'reviewCount'>) => {
    if (!currentUser) return;

    const { user, business } = storageService.upgradeUserToBusiness(currentUser.id, businessData);
    setCurrentUser(user);
    setBusinesses([...businesses, business]);
    setShowUpgradeModal(false);
    setViewMode('business-dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    storageService.updateUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1
              onClick={() => setViewMode('directory')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            >
              BuscaNegocio
            </h1>

            <div>
              {currentUser ? (
                <UserMenu
                  user={currentUser}
                  onSettings={() => setShowSettings(true)}
                  onLogout={handleLogout}
                  onBusinessDashboard={currentUser.type === 'business' ? () => setViewMode('business-dashboard') : undefined}
                  onEvents={() => setViewMode('events')}
                />
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

          <nav className="flex gap-2">
            <button
              onClick={() => setViewMode('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'directory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Directorio
            </button>

            <button
              onClick={() => setViewMode('delivery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'delivery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PackageIcon className="w-4 h-4" />
              Mensajería
            </button>

          </nav>
        </div>
      </header>

      {viewMode === 'directory' && (
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
      )}

      {viewMode === 'business-dashboard' && currentUser?.type === 'business' && (
        <BusinessDashboard user={currentUser} onClose={() => setViewMode('directory')} />
      )}

      {viewMode === 'delivery' && <DeliveryService onClose={() => setViewMode('directory')} />}

      {viewMode === 'events' && currentUser && (
        <EventManager user={currentUser} />
      )}

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

      {showSettings && currentUser && (
        <UserSettings
          user={currentUser}
          onClose={() => setShowSettings(false)}
          onUpgrade={handleUpgrade}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showUpgradeModal && currentUser && (
        <UpgradeModal
          userName={currentUser.name}
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={handleConfirmUpgrade}
        />
      )}
    </div>
  );
}

export default App;
