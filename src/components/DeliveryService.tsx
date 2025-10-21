import { useState, useEffect } from 'react';
import { X, Package as PackageIcon, Plus, Search, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Package, PackageStatus } from '../types';
import { deliveryService } from '../services/delivery';

interface DeliveryServiceProps {
  onClose: () => void;
}

export function DeliveryService({ onClose }: DeliveryServiceProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<PackageStatus | 'all'>('all');

  const [newPackage, setNewPackage] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    packageDescription: '',
    weight: 0,
    dimensions: '',
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = () => {
    const allPackages = deliveryService.getPackages();
    setPackages(allPackages);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    deliveryService.createPackage(newPackage);
    setNewPackage({
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: '',
      packageDescription: '',
      weight: 0,
      dimensions: '',
    });
    setShowNewPackageForm(false);
    loadPackages();
  };

  const handleUpdateStatus = (packageId: string, status: PackageStatus) => {
    deliveryService.updatePackageStatus(packageId, status);
    loadPackages();
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: PackageStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: PackageStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: PackageStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_transit':
        return 'En tránsito';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-xl max-w-6xl mx-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <PackageIcon className="w-7 h-7 text-blue-600" />
              Servicio de Mensajería
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <button
                onClick={() => setShowNewPackageForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Envío
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as PackageStatus | 'all')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_transit">En tránsito</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            {showNewPackageForm && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Envío</h3>
                <form onSubmit={handleCreatePackage} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Remitente</h4>
                      <input
                        type="text"
                        placeholder="Nombre"
                        required
                        value={newPackage.senderName}
                        onChange={(e) => setNewPackage({ ...newPackage, senderName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        required
                        value={newPackage.senderPhone}
                        onChange={(e) => setNewPackage({ ...newPackage, senderPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Dirección"
                        required
                        value={newPackage.senderAddress}
                        onChange={(e) => setNewPackage({ ...newPackage, senderAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Destinatario</h4>
                      <input
                        type="text"
                        placeholder="Nombre"
                        required
                        value={newPackage.recipientName}
                        onChange={(e) => setNewPackage({ ...newPackage, recipientName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Teléfono"
                        required
                        value={newPackage.recipientPhone}
                        onChange={(e) => setNewPackage({ ...newPackage, recipientPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Dirección"
                        required
                        value={newPackage.recipientAddress}
                        onChange={(e) => setNewPackage({ ...newPackage, recipientAddress: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Descripción del paquete"
                      required
                      value={newPackage.packageDescription}
                      onChange={(e) => setNewPackage({ ...newPackage, packageDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                    />
                    <input
                      type="number"
                      placeholder="Peso (kg)"
                      required
                      min="0.1"
                      step="0.1"
                      value={newPackage.weight || ''}
                      onChange={(e) => setNewPackage({ ...newPackage, weight: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Dimensiones (ej: 30x20x15 cm)"
                    required
                    value={newPackage.dimensions}
                    onChange={(e) => setNewPackage({ ...newPackage, dimensions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowNewPackageForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Crear Envío
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No hay envíos registrados</p>
                </div>
              ) : (
                filteredPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(pkg.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pkg.status)}`}>
                            {getStatusLabel(pkg.status)}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">ID: {pkg.id.slice(0, 8)}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">REMITENTE</p>
                            <p className="font-medium text-gray-800">{pkg.senderName}</p>
                            <p className="text-sm text-gray-600">{pkg.senderPhone}</p>
                            <p className="text-sm text-gray-600">{pkg.senderAddress}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">DESTINATARIO</p>
                            <p className="font-medium text-gray-800">{pkg.recipientName}</p>
                            <p className="text-sm text-gray-600">{pkg.recipientPhone}</p>
                            <p className="text-sm text-gray-600">{pkg.recipientAddress}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{pkg.packageDescription}</span>
                          <span>•</span>
                          <span>{pkg.weight} kg</span>
                          <span>•</span>
                          <span>{pkg.dimensions}</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">${pkg.price}</span>
                        </div>

                        <p className="text-xs text-gray-500">
                          Creado: {new Date(pkg.createdAt).toLocaleString('es-ES')}
                          {pkg.deliveredAt && ` • Entregado: ${new Date(pkg.deliveredAt).toLocaleString('es-ES')}`}
                        </p>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        {pkg.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(pkg.id, 'in_transit')}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                            >
                              En tránsito
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(pkg.id, 'cancelled')}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {pkg.status === 'in_transit' && (
                          <button
                            onClick={() => handleUpdateStatus(pkg.id, 'delivered')}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Marcar entregado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
