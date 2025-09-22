// src/pages/Marketplace.jsx
import React, { useState } from "react";
import {
  Leaf,
  Sun,
  Factory,
  Recycle,
  Bus,
  Building2,
  Globe,
  Search,
  Filter,
  MapPin,
  TrendingUp,
  Eye,
  Heart,
  Star,
  Grid,
  List,
  CheckCircle,
  Zap,
  TreePine,
  Droplets,
  X,
} from "lucide-react";

const categories = [
  { id: "all", label: "Semua Proyek", icon: Globe },
  { id: "offset", label: "Proyek Offset", icon: Leaf },
  { id: "captrade", label: "Cap & Trade", icon: Building2 },
];

const subCategories = [
  { id: "forestry", label: "Kehutanan", icon: TreePine, color: "emerald" },
  { id: "renewable", label: "Energi Terbarukan", icon: Sun, color: "yellow" },
  { id: "efficiency", label: "Efisiensi Energi", icon: Zap, color: "blue" },
  { id: "waste", label: "Pengelolaan Limbah", icon: Recycle, color: "green" },
  { id: "transport", label: "Transportasi", icon: Bus, color: "indigo" },
  { id: "industry", label: "Industri", icon: Factory, color: "gray" },
  { id: "water", label: "Pengelolaan Air", icon: Droplets, color: "cyan" },
  { id: "agriculture", label: "Pertanian", icon: Leaf, color: "lime" },
];

// Enhanced dummy data proyek
const projects = [
  {
    id: 1,
    title: "Reforestasi Hutan Kalimantan Timur",
    category: "offset",
    subCategory: "forestry",
    location: "Kalimantan Timur",
    price: 75000,
    currency: "IDR",
    volume: 10000,
    availableVolume: 8500,
    rating: 4.8,
    reviews: 127,
    company: "PT Hijau Bersama",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Proyek restorasi hutan tropis seluas 5.000 hektar dengan fokus pada konservasi biodiversitas dan pemberdayaan masyarakat lokal.",
    certifications: ["VCS", "Gold Standard", "CCB"],
    projectType: "Reforestasi & Konservasi",
    startDate: "2023-01-15",
    duration: "25 tahun",
    cobenefits: ["Biodiversitas", "Ekonomi Lokal", "Air Bersih"],
    status: "active",
    featured: true,
  },
  {
    id: 2,
    title: "Pembangkit Tenaga Surya Atap Jawa Barat",
    category: "offset",
    subCategory: "renewable",
    location: "Bandung, Jawa Barat",
    price: 82500,
    currency: "IDR",
    volume: 25000,
    availableVolume: 18200,
    rating: 4.6,
    reviews: 89,
    company: "PT Energi Surya Nusantara",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Instalasi panel surya atap dengan kapasitas 15 MW yang menggantikan listrik dari batubara untuk gedung komersial.",
    certifications: ["VER", "I-REC"],
    projectType: "Energi Terbarukan",
    startDate: "2023-03-10",
    duration: "20 tahun",
    cobenefits: ["Udara Bersih", "Teknologi Hijau", "Lapangan Kerja"],
    status: "active",
    featured: false,
  },
  {
    id: 3,
    title: "Efisiensi Energi Pabrik Semen Hijau",
    category: "offset",
    subCategory: "efficiency",
    location: "Semarang, Jawa Tengah",
    price: 91000,
    currency: "IDR",
    volume: 8500,
    availableVolume: 6300,
    rating: 4.7,
    reviews: 64,
    company: "PT Semen Hijau",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Implementasi teknologi efisiensi energi modern yang mengurangi konsumsi energi pabrik hingga 30%.",
    certifications: ["VCS", "ISO 14001"],
    projectType: "Industri Manufaktur",
    startDate: "2022-11-20",
    duration: "15 tahun",
    cobenefits: ["Efisiensi Operasional", "Teknologi Bersih", "Inovasi"],
    status: "active",
    featured: true,
  },
  {
    id: 4,
    title: "Pengelolaan Gas Metana TPA Bantar Gebang",
    category: "offset",
    subCategory: "waste",
    location: "Bekasi, DKI Jakarta",
    price: 68000,
    currency: "IDR",
    volume: 15000,
    availableVolume: 12800,
    rating: 4.5,
    reviews: 112,
    company: "PT Bersih Kota",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Sistem capture dan pemanfaatan gas metana dari TPA terbesar di Indonesia untuk pembangkit listrik.",
    certifications: ["CDM", "VCS"],
    projectType: "Pengelola Limbah",
    startDate: "2023-02-05",
    duration: "12 tahun",
    cobenefits: ["Sanitasi", "Energi Bersih", "Kesehatan Publik"],
    status: "active",
    featured: false,
  },
  {
    id: 5,
    title: "Bus Listrik TransJakarta Koridor 1",
    category: "offset",
    subCategory: "transport",
    location: "Jakarta Pusat",
    price: 95000,
    currency: "IDR",
    volume: 12000,
    availableVolume: 9500,
    rating: 4.9,
    reviews: 203,
    company: "TransJakarta",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Pengoperasian 200 bus listrik yang menggantikan bus berbahan bakar fosil di koridor tersibuk Jakarta.",
    certifications: ["Gold Standard", "SDVista"],
    projectType: "Transportasi Publik",
    startDate: "2023-06-01",
    duration: "10 tahun",
    cobenefits: ["Udara Bersih", "Transportasi Publik", "Smart City"],
    status: "active",
    featured: true,
  },
  {
    id: 6,
    title: "Skema Cap & Trade Pabrik Baja Terpadu",
    category: "captrade",
    subCategory: "industry",
    location: "Cilegon, Banten",
    price: 120000,
    currency: "IDR",
    volume: 5000,
    availableVolume: 3200,
    rating: 4.4,
    reviews: 45,
    company: "PT Baja Lestari",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Program cap and trade untuk industri baja dengan implementasi teknologi Carbon Capture and Storage (CCS).",
    certifications: ["EU ETS Compatible", "VCS"],
    projectType: "Industri Baja",
    startDate: "2023-04-12",
    duration: "8 tahun",
    cobenefits: ["Teknologi CCS", "Industri Bersih", "R&D"],
    status: "active",
    featured: false,
  },
  {
    id: 7,
    title: "Mangrove Restoration Sumatra",
    category: "offset",
    subCategory: "forestry",
    location: "Riau, Sumatra",
    price: 85000,
    currency: "IDR",
    volume: 18000,
    availableVolume: 15600,
    rating: 4.8,
    reviews: 156,
    company: "Yayasan Mangrove Indonesia",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Restorasi ekosistem mangrove seluas 8.000 hektar untuk blue carbon dan perlindungan pesisir.",
    certifications: ["VCS", "CCB", "Plan Vivo"],
    projectType: "Blue Carbon",
    startDate: "2023-01-08",
    duration: "30 tahun",
    cobenefits: ["Perlindungan Pesisir", "Perikanan", "Ekowisata"],
    status: "active",
    featured: true,
  },
  {
    id: 8,
    title: "Biogas Komunitas Bali Organik",
    category: "offset",
    subCategory: "waste",
    location: "Ubud, Bali",
    price: 72000,
    currency: "IDR",
    volume: 6500,
    availableVolume: 5100,
    rating: 4.7,
    reviews: 78,
    company: "Komunitas Bali Organik",
    verified: true,
    image: "/api/placeholder/400/240",
    description:
      "Sistem biogas komunal dari limbah organik pasar tradisional dan sampah rumah tangga.",
    certifications: ["Gold Standard", "VER"],
    projectType: "Teknologi Bersih",
    startDate: "2023-05-20",
    duration: "15 tahun",
    cobenefits: ["Zero Waste", "Energi Lokal", "Ekonomi Sirkular"],
    status: "active",
    featured: false,
  },
];

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([50000, 150000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    quantity: 1,
    buyerInfo: {
      name: "",
      email: "",
      company: "",
      phone: "",
    },
  });

  // Modal functions - ADDED THESE MISSING FUNCTIONS
  const openProjectDetail = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  // Purchase functions
  const openPurchaseModal = (project) => {
    setSelectedProject(project);
    setShowPurchaseModal(true);
    setShowModal(false);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
    setPurchaseData({
      quantity: 1,
      buyerInfo: {
        name: "",
        email: "",
        company: "",
        phone: "",
      },
    });
  };

  const handlePurchaseInputChange = (field, value) => {
    if (field === "quantity") {
      setPurchaseData((prev) => ({ ...prev, quantity: parseInt(value) || 1 }));
    } else {
      setPurchaseData((prev) => ({
        ...prev,
        buyerInfo: { ...prev.buyerInfo, [field]: value },
      }));
    }
  };

  const processPurchase = () => {
    const { quantity, buyerInfo } = purchaseData;
    const totalPrice = selectedProject.price * quantity;

    // Simulate purchase process
    alert(`Pembelian Berhasil!
    
Proyek: ${selectedProject.title}
Jumlah: ${formatNumber(quantity)} tCO₂e
Total Harga: ${formatCurrency(totalPrice)}
    
Pembeli: ${buyerInfo.name}
Email: ${buyerInfo.email}
    
Sertifikat digital akan dikirim ke email Anda dalam 1-2 hari kerja.
Terima kasih telah berkontribusi untuk lingkungan!`);

    closePurchaseModal();
  };

  // Wishlist functions
  const isInWishlist = (projectId) => {
    return wishlist.some((item) => item.id === projectId);
  };

  const addToWishlist = (project) => {
    if (!isInWishlist(project.id)) {
      setWishlist((prev) => [...prev, { ...project, addedAt: new Date() }]);
      alert(`${project.title} berhasil ditambahkan ke wishlist!`);
    } else {
      alert("Proyek sudah ada di wishlist Anda.");
    }
  };

  const removeFromWishlist = (projectId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== projectId));
    alert("Proyek berhasil dihapus dari wishlist.");
  };

  // Wishlist modal functions
  const openWishlistModal = () => {
    setShowWishlistModal(true);
  };

  const closeWishlistModal = () => {
    setShowWishlistModal(false);
  };

  const clearAllWishlist = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus semua item dari wishlist?"
      )
    ) {
      setWishlist([]);
      alert("Semua item berhasil dihapus dari wishlist.");
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      if (activeCategory !== "all" && project.category !== activeCategory)
        return false;
      if (
        selectedSubCategory !== "all" &&
        project.subCategory !== selectedSubCategory
      )
        return false;
      if (
        searchTerm &&
        !project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      if (project.price < priceRange[0] || project.price > priceRange[1])
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "volume":
          return b.availableVolume - a.availableVolume;
        case "featured":
          return b.featured - a.featured;
        default:
          return 0;
      }
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const getSubCategoryColor = (subCategory) => {
    const sub = subCategories.find((s) => s.id === subCategory);
    return sub ? sub.color : "gray";
  };

  const getSubCategoryIcon = (subCategory) => {
    const sub = subCategories.find((s) => s.id === subCategory);
    return sub ? sub.icon : Factory;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Marketplace ChainCarbon
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Temukan proyek berkualitas tinggi untuk offset karbon dan investasi
            berkelanjutan Anda
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari proyek, lokasi, atau perusahaan..."
                  className="w-full pl-12 pr-4 py-4 rounded-l-2xl text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-r-2xl font-semibold transition-colors">
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      activeCategory === cat.id
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg scale-105"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-300"
                    }`}
                  >
                    <Icon size={18} />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {/* Wishlist Button */}
              <button
                onClick={openWishlistModal}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative"
              >
                <Heart
                  size={16}
                  className={
                    wishlist.length > 0 ? "text-red-500" : "text-slate-600"
                  }
                  fill={wishlist.length > 0 ? "currentColor" : "none"}
                />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length > 99 ? "99+" : wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Filter size={16} />
                Filter
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="featured">Unggulan</option>
                <option value="price_low">Harga: Rendah ke Tinggi</option>
                <option value="price_high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="volume">Volume Terbesar</option>
              </select>

              <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-emerald-500 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sub Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kategori Proyek
                  </label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    <option value="all">Semua Kategori</option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rentang Harga
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Verification Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Terverifikasi</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {filteredProjects.length} Proyek Ditemukan
            </h2>
            {searchTerm && (
              <span className="text-slate-600">untuk "{searchTerm}"</span>
            )}
          </div>
          <div className="text-slate-600">
            Total Volume:{" "}
            <span className="font-semibold text-emerald-600">
              {formatNumber(
                filteredProjects.reduce((sum, p) => sum + p.availableVolume, 0)
              )}{" "}
              tCO₂e
            </span>
          </div>
        </div>

        {/* Project Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }
        >
          {filteredProjects.map((project) => {
            const SubCategoryIcon = getSubCategoryIcon(project.subCategory);
            const colorScheme = getSubCategoryColor(project.subCategory);

            return (
              <div
                key={project.id}
                className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-emerald-300 relative ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Project Image */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-80" : "h-48"
                  } bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center overflow-hidden`}
                >
                  <SubCategoryIcon
                    size={48}
                    className={`text-${colorScheme}-500`}
                  />
                  {project.verified && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle
                        size={24}
                        className="text-emerald-500 bg-white rounded-full"
                      />
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 bg-${colorScheme}-100 text-${colorScheme}-700 rounded-full text-sm font-medium`}
                        >
                          {project.projectType}
                        </span>
                        {project.certifications.slice(0, 2).map((cert, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        isInWishlist(project.id)
                          ? removeFromWishlist(project.id)
                          : addToWishlist(project)
                      }
                      className={`transition-colors ${
                        isInWishlist(project.id)
                          ? "text-red-500"
                          : "text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={
                          isInWishlist(project.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="text-slate-600">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={16} className="text-slate-400" />
                      <span className="text-slate-600">{project.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp size={16} className="text-slate-400" />
                      <span className="text-slate-600">
                        {formatNumber(project.availableVolume)} /{" "}
                        {formatNumber(project.volume)} tCO₂e tersedia
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(project.price)}
                      </div>
                      <div className="text-sm text-slate-500">per tCO₂e</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="font-semibold text-slate-700">
                        {project.rating}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({project.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openProjectDetail(project)}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-3 px-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Lihat Detail
                    </button>
                    <button className="p-3 border border-emerald-300 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors">
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Coba ubah filter pencarian atau kata kunci untuk menemukan proyek
              yang sesuai dengan kebutuhan Anda.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
                setSelectedSubCategory("all");
                setPriceRange([50000, 150000]);
              }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-50 transition-colors">
              Muat Lebih Banyak Proyek
            </button>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <div className="h-64 bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center overflow-hidden">
                {React.createElement(
                  getSubCategoryIcon(selectedProject.subCategory),
                  {
                    size: 80,
                    className: `text-${getSubCategoryColor(
                      selectedProject.subCategory
                    )}-500`,
                  }
                )}
              </div>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>

              {selectedProject.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                </div>
              )}

              {selectedProject.verified && (
                <div className="absolute bottom-4 right-4">
                  <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <CheckCircle size={16} />
                    Terverifikasi
                  </div>
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Title and Basic Info */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  {selectedProject.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span
                    className={`px-4 py-2 bg-${getSubCategoryColor(
                      selectedProject.subCategory
                    )}-100 text-${getSubCategoryColor(
                      selectedProject.subCategory
                    )}-700 rounded-full font-medium`}
                  >
                    {selectedProject.projectType}
                  </span>
                  {selectedProject.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-slate-400" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          Lokasi
                        </div>
                        <div className="text-slate-600">
                          {selectedProject.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 size={20} className="text-slate-400" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          Perusahaan
                        </div>
                        <div className="text-slate-600">
                          {selectedProject.company}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={20} className="text-slate-400" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          Volume Tersedia
                        </div>
                        <div className="text-slate-600">
                          {formatNumber(selectedProject.availableVolume)} /{" "}
                          {formatNumber(selectedProject.volume)} tCO₂e
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star
                        size={20}
                        className="text-yellow-400 fill-current"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">
                          Rating
                        </div>
                        <div className="text-slate-600">
                          {selectedProject.rating}/5 ({selectedProject.reviews}{" "}
                          ulasan)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {formatCurrency(selectedProject.price)}
                    </div>
                    <div className="text-slate-600">per tCO₂e</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">
                      Durasi Proyek
                    </div>
                    <div className="font-semibold text-slate-700">
                      {selectedProject.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Deskripsi Proyek
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Co-benefits */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Manfaat Tambahan
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.cobenefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-slate-800 mb-3">
                    Informasi Proyek
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tanggal Mulai:</span>
                      <span className="font-medium text-slate-800">
                        {new Date(selectedProject.startDate).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="font-medium text-emerald-600 capitalize">
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mata Uang:</span>
                      <span className="font-medium text-slate-800">
                        {selectedProject.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-3">Sertifikasi</h4>
                  <div className="space-y-2">
                    {selectedProject.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span className="text-slate-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => openPurchaseModal(selectedProject)}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Beli Kredit Karbon
                </button>
                <button
                  onClick={() =>
                    isInWishlist(selectedProject.id)
                      ? removeFromWishlist(selectedProject.id)
                      : addToWishlist(selectedProject)
                  }
                  className={`px-6 py-4 border-2 rounded-xl font-bold transition-colors ${
                    isInWishlist(selectedProject.id)
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {isInWishlist(selectedProject.id)
                    ? "Hapus dari Wishlist"
                    : "Simpan ke Wishlist"}
                </button>
                <button className="px-6 py-4 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlistModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Wishlist Header */}
            <div className="relative bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-t-3xl">
              <button
                onClick={closeWishlistModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={24} className="text-white" fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Wishlist Saya
                </h2>
                <p className="text-slate-600">
                  {wishlist.length === 0
                    ? "Belum ada proyek yang disimpan"
                    : `${wishlist.length} proyek tersimpan`}
                </p>
              </div>
            </div>

            {/* Wishlist Content */}
            <div className="p-8">
              {wishlist.length === 0 ? (
                /* Empty Wishlist State */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Wishlist Kosong
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Mulai jelajahi proyek-proyek menarik dan simpan yang Anda
                    sukai untuk dilihat nanti.
                  </p>
                  <button
                    onClick={closeWishlistModal}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Jelajahi Proyek
                  </button>
                </div>
              ) : (
                /* Wishlist Items */
                <div>
                  {/* Wishlist Actions */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-slate-800">
                        Proyek Tersimpan ({wishlist.length})
                      </h3>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Total Estimasi:{" "}
                        {formatCurrency(
                          wishlist.reduce((sum, item) => sum + item.price, 0)
                        )}
                      </span>
                    </div>

                    <button
                      onClick={clearAllWishlist}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
                    >
                      Hapus Semua
                    </button>
                  </div>

                  {/* Wishlist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((project) => {
                      const SubCategoryIcon = getSubCategoryIcon(
                        project.subCategory
                      );
                      const colorScheme = getSubCategoryColor(
                        project.subCategory
                      );

                      return (
                        <div
                          key={project.id}
                          className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-red-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
                        >
                          {/* Project Image */}
                          <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                            <SubCategoryIcon
                              size={32}
                              className={`text-${colorScheme}-500`}
                            />
                            {project.verified && (
                              <div className="absolute top-3 left-3">
                                <CheckCircle
                                  size={20}
                                  className="text-emerald-500 bg-white rounded-full"
                                />
                              </div>
                            )}

                            {/* Remove from Wishlist Button */}
                            <button
                              onClick={() => removeFromWishlist(project.id)}
                              className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>

                            {project.featured && (
                              <div className="absolute bottom-3 left-3">
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <Star size={10} fill="currentColor" />
                                  Featured
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Project Details */}
                          <div className="p-6">
                            <div className="mb-4">
                              <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
                                {project.title}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 bg-${colorScheme}-100 text-${colorScheme}-700 rounded-full text-xs font-medium`}
                                >
                                  {project.projectType}
                                </span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                  {project.certifications[0]}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin size={14} className="text-slate-400" />
                                <span className="text-slate-600">
                                  {project.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Building2
                                  size={14}
                                  className="text-slate-400"
                                />
                                <span className="text-slate-600">
                                  {project.company}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <TrendingUp
                                  size={14}
                                  className="text-slate-400"
                                />
                                <span className="text-slate-600">
                                  {formatNumber(project.availableVolume)} tCO₂e
                                  tersedia
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-lg font-bold text-emerald-600">
                                  {formatCurrency(project.price)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  per tCO₂e
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star
                                  size={14}
                                  className="text-yellow-400 fill-current"
                                />
                                <span className="font-semibold text-slate-700 text-sm">
                                  {project.rating}
                                </span>
                                <span className="text-slate-500 text-xs">
                                  ({project.reviews})
                                </span>
                              </div>
                            </div>

                            {/* Added Date */}
                            <div className="mb-4">
                              <span className="text-xs text-slate-500">
                                Ditambahkan:{" "}
                                {new Date(project.addedAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowWishlistModal(false);
                                  setShowModal(true);
                                }}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-2 px-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-md text-sm"
                              >
                                Lihat Detail
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowWishlistModal(false);
                                  setShowPurchaseModal(true);
                                }}
                                className="px-4 py-2 border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors text-sm"
                              >
                                Beli
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bulk Actions */}
                  {wishlist.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="text-center">
                          <p className="text-slate-600 mb-4">
                            Ingin membeli beberapa proyek sekaligus?
                          </p>
                          <button className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                            Beli Semua ({wishlist.length} Proyek)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Purchase Header */}
            <div className="relative bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 rounded-t-3xl">
              <button
                onClick={closePurchaseModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Beli Kredit Karbon
                </h2>
                <p className="text-slate-600">
                  Lengkapi formulir untuk melakukan pembelian
                </p>
              </div>
            </div>

            {/* Purchase Content */}
            <div className="p-8">
              {/* Project Summary */}
              <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-slate-800 mb-4">Detail Proyek</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Proyek:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedProject.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Harga per tCO₂e:</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(selectedProject.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tersedia:</span>
                    <span className="font-semibold text-slate-800">
                      {formatNumber(selectedProject.availableVolume)} tCO₂e
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Form */}
              <form className="space-y-6">
                {/* Quantity Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jumlah Kredit Karbon (tCO₂e) *
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        handlePurchaseInputChange(
                          "quantity",
                          Math.max(1, purchaseData.quantity - 1)
                        )
                      }
                      className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProject.availableVolume}
                      value={purchaseData.quantity}
                      onChange={(e) =>
                        handlePurchaseInputChange("quantity", e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 text-center font-semibold text-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePurchaseInputChange(
                          "quantity",
                          Math.min(
                            selectedProject.availableVolume,
                            purchaseData.quantity + 1
                          )
                        )
                      }
                      className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Maximum: {formatNumber(selectedProject.availableVolume)}{" "}
                    tCO₂e
                  </p>
                </div>

                {/* Price Calculation */}
                <div className="bg-emerald-50 rounded-2xl p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          selectedProject.price * purchaseData.quantity
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Platform Fee (5%):</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          selectedProject.price * purchaseData.quantity * 0.05
                        )}
                      </span>
                    </div>
                    <div className="border-t border-emerald-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-800">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(
                            selectedProject.price * purchaseData.quantity * 1.05
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={purchaseData.buyerInfo.name}
                      onChange={(e) =>
                        handlePurchaseInputChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={purchaseData.buyerInfo.email}
                      onChange={(e) =>
                        handlePurchaseInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Perusahaan/Organisasi
                    </label>
                    <input
                      type="text"
                      value={purchaseData.buyerInfo.company}
                      onChange={(e) =>
                        handlePurchaseInputChange("company", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="Nama perusahaan (opsional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={purchaseData.buyerInfo.phone}
                      onChange={(e) =>
                        handlePurchaseInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      placeholder="+62 xxx xxx xxxx"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" required className="mt-1" />
                    <div className="text-sm text-slate-600">
                      <p>
                        Saya menyetujui{" "}
                        <button
                          type="button"
                          className="text-emerald-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Syarat dan Ketentuan
                        </button>{" "}
                        serta{" "}
                        <button
                          type="button"
                          className="text-emerald-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Kebijakan Privasi
                        </button>{" "}
                        ChainCarbon.
                      </p>
                      <p className="mt-2">
                        Sertifikat digital akan dikirim dalam 1-2 hari kerja
                        setelah pembayaran dikonfirmasi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purchase Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closePurchaseModal}
                    className="flex-1 px-6 py-4 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={processPurchase}
                    disabled={
                      !purchaseData.buyerInfo.name ||
                      !purchaseData.buyerInfo.email ||
                      !purchaseData.buyerInfo.phone
                    }
                    className="flex-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Lanjutkan ke Pembayaran
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Display (Optional - can be shown in a sidebar or separate page) */}
      {wishlist.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800">
                Wishlist ({wishlist.length})
              </h4>
              <button
                onClick={() => setWishlist([])}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {wishlist.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <Heart
                    size={12}
                    className="text-red-500"
                    fill="currentColor"
                  />
                  <span className="flex-1 truncate text-slate-600">
                    {item.title}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {wishlist.length > 3 && (
                <p className="text-xs text-slate-500 text-center pt-2">
                  +{wishlist.length - 3} more items
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
