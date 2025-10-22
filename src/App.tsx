import { useState, useEffect } from 'react';
import { LogIn, User as UserIcon, Package as PackageIcon } from 'lucide-react';
import { Business, User, SearchResult } from './types';
import { storageService } from './services/storage';
import { searchService } from './services/search';
import { SearchBar } from './components/SearchBar';
import { PromotedCarousel } from './components/PromotedCarousel';
import { BusinessCard } from './components/BusinessCard';
import { ProductCard } from './components/ProductCard';
import { BusinessPage } from './components/BusinessPage';
import { LoginModal } from './components/LoginModal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { DeliveryService } from './components/DeliveryService';
import { UserSettings } from './components/UserSettings';
import { EventManager } from './components/EventManager';
import { UpgradeModal } from './components/UpgradeModal';
import { UserMenu } from './components/UserMenu';
import { AddEventModal } from './components/AddEventModal';

type ViewMode = 'directory' | 'business-dashboard' | 'delivery' | 'events' | 'business-page';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventBusinessId, setEventBusinessId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    storageService.initializeSampleData();
    const loadedBusinesses = storageService.getBusinesses();
    setBusinesses(loadedBusinesses);
    setSearchResults(searchService.search('', loadedBusinesses));

    const user = storageService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const results = searchService.search(searchQuery, businesses);
    setSearchResults(results);
  }, [searchQuery, businesses]);

  const businessResults = searchResults.filter(r => r.type === 'business');
  const productResults = searchResults.filter(r => r.type === 'product');
  const groupedBusinesses = searchService.groupByPromotionTier(
    businessResults.map(r => r.business!)
  );

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

  const handleOpenAddEvent = (businessId: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    setEventBusinessId(businessId);
    setShowEventModal(true);
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setEventBusinessId(null);
  };

  const handleAddEventSubmit = (eventData: {
    title: string;
    category: 'cinema' | 'theater';
    description: string;
    image: string;
    date: string;
    time: string;
    venue: string;
    price: number;
  }) => {
    if (!currentUser || !eventBusinessId) return;

    const event = {
      id: Date.now().toString(),
      ...eventData,
      userId: currentUser.id,
      businessId: eventBusinessId,
      createdAt: new Date().toISOString(),
    };

    storageService.addEvent(event);

    if (selectedBusiness && selectedBusiness.id === eventBusinessId) {
      const updatedBusiness = businesses.find(b => b.id === eventBusinessId);
      if (updatedBusiness) {
        setSelectedBusiness(updatedBusiness);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center justify-between">
              <h1
                onClick={() => setViewMode('directory')}
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity dark:from-blue-400 dark:to-orange-400"
              >
                Buscalo!
              </h1>

              <div className="sm:hidden">
                {currentUser ? (
                  <UserMenu
                    user={currentUser}
                    onSettings={() => setShowSettings(true)}
                    onLogout={handleLogout}
                    onBusinessDashboard={currentUser.type === 'business' ? () => setViewMode('business-dashboard') : undefined}
                    onEvents={() => setViewMode('events')}
                    onUpgrade={currentUser.type === 'customer' ? handleUpgrade : undefined}
                  />
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar</span>
                  </button>
                )}
              </div>
            </div>

            <nav className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('directory')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
                  viewMode === 'directory'
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">Directorio</span>
              </button>

              <button
                onClick={() => setViewMode('delivery')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
                  viewMode === 'delivery'
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <PackageIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">Mensajería</span>
              </button>
            </nav>

            <div className="hidden sm:block">
              {currentUser ? (
                <UserMenu
                  user={currentUser}
                  onSettings={() => setShowSettings(true)}
                  onLogout={handleLogout}
                  onBusinessDashboard={currentUser.type === 'business' ? () => setViewMode('business-dashboard') : undefined}
                  onEvents={() => setViewMode('events')}
                  onUpgrade={currentUser.type === 'customer' ? handleUpgrade : undefined}
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
        </div>
      </header>

      {viewMode === 'directory' && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center px-2">
              Descubre los mejores lugares
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-4 sm:mb-6 px-2">
              Restaurantes, entretenimiento, tiendas y más
            </p>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {searchQuery.trim() ? (
            <div className="space-y-6 sm:space-y-8">
              {groupedBusinesses.premium.length > 0 && (
                <PromotedCarousel
                  businesses={groupedBusinesses.premium}
                  title="⭐ Destacados Premium"
                  onBusinessClick={(business) => {
                    setSelectedBusiness(business);
                    setViewMode('business-page');
                  }}
                />
              )}

              {groupedBusinesses.gold.length > 0 && (
                <PromotedCarousel
                  businesses={groupedBusinesses.gold}
                  title="🏆 Promocionados Gold"
                  onBusinessClick={(business) => {
                    setSelectedBusiness(business);
                    setViewMode('business-page');
                  }}
                />
              )}

              {groupedBusinesses.silver.length > 0 && (
                <PromotedCarousel
                  businesses={groupedBusinesses.silver}
                  title="✨ Promocionados Silver"
                  onBusinessClick={(business) => {
                    setSelectedBusiness(business);
                    setViewMode('business-page');
                  }}
                />
              )}

              {groupedBusinesses.regular.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Negocios
                  </h2>
                  <div className="space-y-3">
                    {groupedBusinesses.regular.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        onClick={() => {
                          setSelectedBusiness(business);
                          setViewMode('business-page');
                        }}
                        variant="list"
                      />
                    ))}
                  </div>
                </div>
              )}

              {productResults.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Productos
                  </h2>
                  <div className="space-y-3">
                    {productResults.map((result) => (
                      <ProductCard
                        key={result.product!.id}
                        product={result.product!}
                        parentBusiness={result.parentBusiness!}
                        onClick={() => {
                          setSelectedBusiness(result.parentBusiness!);
                          setViewMode('business-page');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No se encontraron resultados para "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Comienza a buscar para descubrir negocios
              </p>
            </div>
          )}
        </main>
      )}

      {viewMode === 'business-dashboard' && currentUser?.type === 'business' && (
        <BusinessDashboard user={currentUser} onClose={() => setViewMode('directory')} />
      )}

      {viewMode === 'delivery' && <DeliveryService onClose={() => setViewMode('directory')} />}

      {viewMode === 'events' && currentUser && (
        <EventManager user={currentUser} />
      )}

      {viewMode === 'business-page' && selectedBusiness && (
        <BusinessPage
          business={selectedBusiness}
          reviews={storageService.getReviewsByBusiness(selectedBusiness.id)}
          events={storageService.getEventsByBusiness(selectedBusiness.id)}
          currentUser={currentUser}
          onBack={() => {
            setSelectedBusiness(null);
            setViewMode('directory');
          }}
          onAddReview={handleAddReview}
          onAddEvent={() => handleOpenAddEvent(selectedBusiness.id)}
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
          onThemeChange={setTheme}
        />
      )}

      {showUpgradeModal && currentUser && (
        <UpgradeModal
          userName={currentUser.name}
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={handleConfirmUpgrade}
        />
      )}

      {showEventModal && eventBusinessId && (
        <AddEventModal
          business={businesses.find(b => b.id === eventBusinessId)!}
          onClose={handleCloseEventModal}
          onSubmit={handleAddEventSubmit}
        />
      )}
    </div>
  );
}

export default App;
