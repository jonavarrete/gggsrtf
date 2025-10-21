import { Package } from '../types';

const STORAGE_KEY = 'packages';

export const deliveryService = {
  getPackages(): Package[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  setPackages(packages: Package[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  },

  createPackage(packageData: Omit<Package, 'id' | 'status' | 'price' | 'createdAt'>): Package {
    const packages = this.getPackages();

    const basePrice = 10;
    const weightPrice = packageData.weight * 2;
    const price = Math.round((basePrice + weightPrice) * 100) / 100;

    const newPackage: Package = {
      ...packageData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      price,
      createdAt: new Date().toISOString(),
    };

    packages.push(newPackage);
    this.setPackages(packages);
    return newPackage;
  },

  updatePackageStatus(packageId: string, status: Package['status']): void {
    const packages = this.getPackages();
    const index = packages.findIndex(p => p.id === packageId);

    if (index !== -1) {
      packages[index].status = status;

      if (status === 'delivered') {
        packages[index].deliveredAt = new Date().toISOString();
      }

      this.setPackages(packages);
    }
  },

  getPackageById(packageId: string): Package | undefined {
    const packages = this.getPackages();
    return packages.find(p => p.id === packageId);
  },

  deletePackage(packageId: string): void {
    const packages = this.getPackages();
    const filtered = packages.filter(p => p.id !== packageId);
    this.setPackages(filtered);
  },
};
