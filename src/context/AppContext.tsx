import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  fullname: string;
  username: string;
  email?: string;
  age?: number;
  profilePicture: string;
  isSubscribed: boolean;
  extraProfiles: string[];
  subscriptionExpiry?: string;
  productionName?: string;
  countryResidence?: string;
  countryProduction?: string;
  bio?: string;
}

interface TileSelectionResponse {
  result: "hit" | "miss";
  message: string;
  balance: number;
  slotsLeft: number;
  gameOver: boolean;
}

interface SubscriptionResponse {
  paymentUrl: string;
  reference: string;
}

interface GameSession {
  _id: string;
  user: string;
  goldenTileIndex: number;
  balance: number;
  slotsLeft: number;
  gameStartTime: string;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  friend: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
}

interface Notification {
  from: string;
  messageId: string;
  senderId: string;
  message: string;
  time: string;
}

interface NotificationsResponse {
  totalUnread: number;
  notifications: Notification[];
}

interface MovieSubtitle {
  language: string;
  url: string;
  _id: string;
}

interface MovieAudioTrack {
  language: string;
  type: string;
  _id: string;
}

interface MovieCastMember {
  name: string;
  character: string;
  order: number;
  _id: string;
}

interface MovieUploadedBy {
  _id: string;
  fullname: string;
  username: string;
}

export interface Movie {
  _id: string;
  title: string;
  originalTitle: string;
  synopsis: string;
  tagline: string;
  releaseDate: string;
  year: number;
  runtime: number;
  language: string;
  countryOfOrigin: string;
  genre: string[];
  ageRating: string;
  contentWarnings: string[];
  posterImage: string;
  backdropImage: string;
  trailerUrl: string;
  subtitles: MovieSubtitle[];
  audioTracks: MovieAudioTrack[];
  resolution: string;
  producers: string[];
  cast: MovieCastMember[];
  productionCompany: string;
  distributor: string;
  uploadedBy: MovieUploadedBy;
  termsAccepted: boolean;
  acceptedViewCountries: string[];
  viewerInterests: string[];
  premiering: boolean;
  premierDate: string;
  showingImmediately: boolean;
  price: number;
  isPublished: boolean;
  approvedByAdmin: boolean;
  views: number;
  totalRatings: number;
  ratingCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface MoviesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface MoviesResponse {
  data: Movie[];
  pagination: MoviesPagination;
}

interface MovieUploadPayload {
  title: string;
  description: string;
  genre: string[];
  language: string;
  year: number;
  price: number;
  ageRestriction: string;
  streamUrl: string;
  trailerUrl: string;
  posterUrl: string;
  backdropUrl: string;
  btsUrl?: string;
  subtitleUrl?: string;
}

export interface ProducerApplicationPayload {
  stripeSessionId?: string;
  email: string;
  fullName: string;
  productionName: string;
  countryOfResidence: string;
  prodCountry: string;
  existingApplication: boolean;
  campaignSource: string;
  bio: string;
  prodDesc: string;
  budget: number;
  intendedProfit: number;
  promoteIntent: string;
  whyUs: string;
  others: string;
}

export interface EarningsDashboardData {
  currentEarning: number;
  totalEarnings: number;
  totalWithdrawal: number;
  totalViewers: number;
  currency: string;
}

export interface EarningRecord {
  id: string;
  amount: number;
  currency: string;
  source: string;
  createdAt: string;
}

export interface EarningsHistoryResponse {
  records: EarningRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface WithdrawalPayload {
  method: "bank_transfer" | "debit_card";
  country: string;
  currency: "USD" | "GBP";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    routingNumber?: string;
    sortCode?: string;
    iban?: string;
  };
  cardDetails?: {
    last4: string;
    cardNetwork: string;
  };
}

export interface WithdrawalResponse {
  message: string;
  withdrawal: {
    id: string;
    amount: number;
    currency: string;
    method: string;
    country: string;
    status: string;
    createdAt: string;
  };
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  currency: string;
  method: string;
  country: string;
  status: string;
  createdAt: string;
}

export interface WithdrawalHistoryResponse {
  records: WithdrawalRecord[];
  total: number;
  page: number;
  limit: number;
}

interface ProducerApplicationResponse {
  message: string;
  credentials?: {
    username?: string;
    password?: string;
  };
  username?: string;
  password?: string;
}

interface ApiContextType {
  // Authentication
  signup: (data: {
    fullname: string;
    email: string;
    age: number;
    username: string;
    password: string;
  }) => Promise<void>;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;

  // Payment
  initializeBankPayment: (email: string) => Promise<SubscriptionResponse>;
  initializeSubscriptionCard: (email: string) => Promise<SubscriptionResponse>;
  initializeAccessBankPayment: (email: string) => Promise<SubscriptionResponse>;
  pendingSubscription: { email: string } | null;
  setPendingSubscription: (data: { email: string } | null) => void;

  // Profile
  uploadProfilePicture: (file: File) => Promise<string>;
  getProfilePicture: () => Promise<string>;
  createExtraProfile: (name: string) => Promise<void>;
  fetchUserProfile: () => Promise<UserProfile>;
  fetchUserProfileDetails: () => Promise<{
    fullname: string;
    username: string;
    email: string;
    age: number;
    productionName?: string;
    countryResidence?: string;
    countryProduction?: string;
    bio?: string;
  }>;
  resetUserProfile: () => Promise<{
    fullname: string;
    username: string;
    email: string;
    age: number;
  }>;
  // updateProfile: (data: {
  //   fullname: string;
  //   username: string;
  //   email: string;
  //   age: number;
  // }) => Promise<{
  //   fullname: string;
  //   username: string;
  //   email: string;
  //   age: number;
  // }>;

  updateProfile: (data: {
    fullname: string;
    username: string;
    productionName?: string;
    countryResidence?: string;
    countryProduction?: string;
    bio?: string;
    email?: string;
    age?: number;
  }) => Promise<any>;
  resetPassword: () => Promise<void>;
  updatePassword: (data: {
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  userProfile: UserProfile | null;

  // Game
  selectTile: (tileIndex: number) => Promise<TileSelectionResponse>;
  quitGame: () => Promise<void>;
  startGame: () => Promise<GameSession | null>;
  currentGame: GameSession | null;

  // Messaging
  getInbox: () => Promise<Conversation[]>;
  getChat: (friendId: string) => Promise<Message[]>;
  sendMessage: (friendId: string, content: string) => Promise<Message>;

  // Notification
  getNotifications: () => Promise<NotificationsResponse>;

  // Movies
  getMovies: () => Promise<MoviesResponse>;
  getMovieById: (id: string) => Promise<Movie>;
  getRecentlyPlayed: (limit?: number) => Promise<any[]>;
  getPremiers: (
    page?: number,
    limit?: number,
  ) => Promise<MoviesResponse | null>;

  movieFile: File | null;
  setMovieFile: React.Dispatch<React.SetStateAction<File | null>>;
  movieFiles: {
    movie: File | null;
    trailer: File | null;
    poster: File | null;
    bts: File | null;
    subtitle: File | null;
  };

  trailerFile: File | null;
  setTrailerFile: React.Dispatch<React.SetStateAction<File | null>>;

  posterFile: File | null;
  setPosterFile: React.Dispatch<React.SetStateAction<File | null>>;

  btsFile: File | null;
  setBtsFile: React.Dispatch<React.SetStateAction<File | null>>;

  subtitleFile: File | null;
  setSubtitleFile: React.Dispatch<React.SetStateAction<File | null>>;

  movieMetadata: {
    title: string;
    producer: string;
    majorCast1: string;
    majorCast2: string;
    minorCast1: string;
    minorCast2: string;
    aboutMovie: string;
    price: string;
    scheduleType: string;
    scheduleDate?: string;
    ageRestriction: string;
    genres: string[];
    language: string;
    year: number;
  };

  setMovieMetadata: React.Dispatch<
    React.SetStateAction<{
      title: string;
      producer: string;
      majorCast1: string;
      majorCast2: string;
      minorCast1: string;
      minorCast2: string;
      aboutMovie: string;
      price: string;
      scheduleType: string;
      scheduleDate?: string;
      ageRestriction: string;
      genres: string[];
      language: string;
      year: number;
    }>
  >;

  publishCompleteMovie: (countries: string, interests: string) => Promise<any>;

  resetUploadWizard: () => void;

  // Producer
  applyAsProducer: (
    data: ProducerApplicationPayload,
  ) => Promise<ProducerApplicationResponse>;

  // Earnings & Withdrawals
  getProducerEarnings: () => Promise<EarningsDashboardData>;
  getEarningsHistory: (page?: number, limit?: number) => Promise<any>;
  withdrawEarnings: (data: WithdrawalPayload) => Promise<WithdrawalResponse>;
  getWithdrawalsHistory: (page?: number, limit?: number) => Promise<any>;

  // Global UI State for Audio
  isAuthFlowActive: boolean;
  setIsAuthFlowActive: (active: boolean) => void;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [pendingSubscription, setPendingSubscription] = useState<{
    email: string;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentGame, setCurrentGame] = useState<GameSession | null>(null);
  const [isAuthFlowActive, setIsAuthFlowActive] = useState(false);
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [btsFile, setBtsFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);

  const [movieMetadata, setMovieMetadata] = useState({
    title: "",
    producer: "",
    majorCast1: "",
    majorCast2: "",
    minorCast1: "",
    minorCast2: "",
    aboutMovie: "",
    price: "",
    scheduleType: "",
    scheduleDate: "",
    ageRestriction: "G",
    genres: [] as string[],
    language: "English",
    year: new Date().getFullYear(),
  });

  const publishCompleteMovie = async (countries: string, interests: string) => {
    try {
      // 1. Identify which assets are being uploaded
      const targetSlots: string[] = [];
      if (movieFile) targetSlots.push("video");
      if (trailerFile) targetSlots.push("trailer");
      if (posterFile) targetSlots.push("posterImage");
      if (btsFile) targetSlots.push("bts");
      if (subtitleFile) targetSlots.push("subtitle");

      if (targetSlots.length === 0) {
        throw new Error("No media files selected for publishing.");
      }

      const token = localStorage.getItem("authToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      toast.loading("Obtaining secure cloud upload tokens...", {
        id: "uploadProgress",
      });

      // 2. Fetch batch presigned signatures from the backend
      const sigRes = await axios.post(
        "/api/upload/signatures",
        {
          slots: targetSlots,
        },
        config,
      );
      const signatureMap: Record<string, any> = {};
      sigRes.data.signatures.forEach((sig: any) => {
        signatureMap[sig.slot] = sig;
      });

      // Match files with their signature slots
      const filePayloads: Record<string, File | null> = {
        video: movieFile,
        trailer: trailerFile,
        posterImage: posterFile,
        bts: btsFile,
        subtitle: subtitleFile,
      };

      const uploadedUrls: Record<string, string> = {};

      // 3. Upload all files concurrently directly to Cloudinary
      await Promise.all(
        targetSlots.map(async (slot) => {
          const file = filePayloads[slot];
          const sigData = signatureMap[slot];
          if (!file || !sigData) return;

          toast.loading(`Uploading your ${slot} asset item...`, {
            id: "uploadProgress",
          });

          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", sigData.apiKey);
          formData.append("timestamp", sigData.timestamp.toString());
          formData.append("signature", sigData.signature);
          formData.append("folder", sigData.folder);

          const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${sigData.resourceType}/upload`;

          // Use clean axios instance to bypass default authorization headers for external requests
          const cleanAxios = axios.create();
          const cldRes = await cleanAxios.post(cloudinaryUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          uploadedUrls[slot] = cldRes.data.secure_url;
        }),
      );

      toast.loading("Persisting movie catalog metadata...", {
        id: "uploadProgress",
      });

      // 4. Clean and parse strings/arrays to conform to the Mongoose Schema rules
      const castArray = [
        movieMetadata.majorCast1,
        movieMetadata.majorCast2,
        movieMetadata.minorCast1,
        movieMetadata.minorCast2,
      ]
        .map((name) => name?.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      const genreArray = Array.isArray(movieMetadata.genres)
        ? movieMetadata.genres.map((g: string) => g.trim()).filter(Boolean)
        : [];

      const targetCountriesArray = countries
        ? countries
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean)
        : [];

      const targetInterestsArray = interests
        ? interests
            .split(",")
            .map((i: string) => i.trim())
            .filter(Boolean)
        : [];

      // Normalize UI string inputs to standard uppercase Mongoose Enum options
      const mapAgeRating = (rating: string) => {
        const cleaned = rating?.trim().toUpperCase();
        if (cleaned === "13+" || cleaned === "PG13") return "PG-13";
        if (cleaned === "16+" || cleaned === "PG16") return "PG-16";
        if (cleaned === "18+" || cleaned === "PG18") return "PG-18";
        if (cleaned === "GENERAL" || cleaned === "ALL" || !cleaned) return "G";
        return cleaned;
      };

      const dbPayload = {
        title: movieMetadata.title?.trim(),
        originalTitle: movieMetadata.title?.trim(),
        synopsis:
          movieMetadata.aboutMovie?.trim() || "No description provided.",
        releaseDate: new Date().toISOString(),
        year: Number(movieMetadata.year) || new Date().getFullYear(),
        runtime: 120, // plsceholder
        language: movieMetadata.language?.trim() || "English",
        countryOfOrigin: "United States",

        // Classification
        genre: genreArray.length > 0 ? genreArray : ["Drama"],
        ageRating: mapAgeRating(movieMetadata.ageRestriction),
        contentWarnings: [],

        // Media Assets
        posterImage: uploadedUrls["posterImage"] || "",
        backdropImage: uploadedUrls["posterImage"] || "",
        streamUrl: uploadedUrls["video"] || "",
        trailerUrl: uploadedUrls["trailer"] || "",
        btsUrl: uploadedUrls["bts"] || "",

        // Subdocument configuration mappings
        subtitles: uploadedUrls["subtitle"]
          ? [
              {
                language: movieMetadata.language?.trim() || "English",
                url: uploadedUrls["subtitle"],
              },
            ]
          : [],
        audioTracks: [
          {
            language: movieMetadata.language?.trim() || "English",
            type: "stereo",
          },
        ],
        resolution: "HD",

        // Crew & Cast
        producers: movieMetadata.producer
          ? [movieMetadata.producer.trim()]
          : ["Independent Producer"],
        cast: castArray,
        productionCompany: "Independent Studio",

        // Platform/Business Settings alignment
        termsAccepted: true,
        acceptedViewCountries: targetCountriesArray,
        viewerInterests: targetInterestsArray,
        premiering: movieMetadata.scheduleType === "premier",
        premierDate:
          movieMetadata.scheduleType === "premier"
            ? movieMetadata.scheduleDate
            : null,
        showingImmediately: movieMetadata.scheduleType === "immediate",
        price: Number(movieMetadata.price) || 2,
        isPublished: false,
        approvedByAdmin: false,
      };
      // 5. Send fully parsed payload directly to your backend endpoint router
      const response = await axios.post("/api/movies", dbPayload, config);

      // toast.success("Movie uploaded and queued for admin approval!", {
      //   id: "uploadProgress",
      // });

      clearUploadWizard();

      return response.data;
    } catch (error: any) {
      console.error("Failed movie publishing operations:", error);
      const serverErrorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      // toast.error(`Publishing failed: ${serverErrorMessage}`, {
      //   id: "uploadProgress",
      // });
      throw error;
    }
  };

  const clearUploadWizard = () => {
    setMovieFile(null);
    setTrailerFile(null);
    setPosterFile(null);
    setBtsFile(null);
    setSubtitleFile(null);
    setMovieMetadata({
      title: "",
      producer: "",
      majorCast1: "",
      majorCast2: "",
      minorCast1: "",
      minorCast2: "",
      aboutMovie: "",
      price: "",
      scheduleType: "",
      scheduleDate: "",
      ageRestriction: "",
      genres: ["Action"],
      language: "English",
      year: new Date().getFullYear(),
    });
  };
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isSubscribed = localStorage.getItem("isSubscribed") === "true";

    if (isLoggedIn && isSubscribed) {
      fetchUserProfile().catch((err) => {
        console.warn(
          "Initial profile fetch failed or subscription required:",
          err,
        );
      });
    }
  }, []);

  const getPremiers = async (page = 1, limit = 20): Promise<MoviesResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}api/movies/premiers`, {
        params: { page, limit },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch premier movies";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Authentication Methods
  const signup = async (data: {
    fullname: string;
    email: string;
    age: number;
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(`${baseUrl}api/users/signup`, data);
      // toast.success(response.data.message || "Signup successful!");

      localStorage.setItem("authToken", response.data.token || "");
      localStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem(
        "fullname",
        response.data.fullname || data.fullname,
      );
      sessionStorage.setItem("email", response.data.email || data.email);
      localStorage.setItem("userId", response.data.userId || "");

      if (response.data.isSubscribed !== undefined) {
        localStorage.setItem(
          "isSubscribed",
          response.data.isSubscribed ? "true" : "false",
        );
      }
      if (response.data.hasGameAccess !== undefined) {
        localStorage.setItem(
          "hasGameAccess",
          response.data.hasGameAccess ? "true" : "false",
        );
      }
      if (response.data.subscriptionType !== undefined) {
        localStorage.setItem(
          "subscriptionType",
          response.data.subscriptionType,
        );
      }
      if (response.data.isProducer !== undefined) {
        localStorage.setItem(
          "isProducer",
          response.data.isProducer ? "true" : "false",
        );
      }

      // Fetch user profile after registration
      fetchUserProfile().catch((err) =>
        console.warn(
          "Profile fetch after signup skipped or subscription required",
          err,
        ),
      );

      if (response.data.isProducer) {
        navigate("/dashboard");
      } else {
        navigate("/profile-locked");
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      // toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await axios.post(`${baseUrl}api/users/login`, data);
      // console.log(response.data);
      // toast.success(response.data.message || "Login successful!");

      localStorage.setItem("authToken", response.data.token || "");
      localStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("fullname", response.data.fullname || "");
      sessionStorage.setItem("email", response.data.email || "");
      localStorage.setItem("userId", response.data.userId || "");

      // Store specific user specification fields: isSubscribed, hasGameAccess, subscriptionType
      if (response.data.isSubscribed !== undefined) {
        localStorage.setItem(
          "isSubscribed",
          response.data.isSubscribed ? response.data.isSubscribed : "false",
        );
      }
      if (response.data.hasGameAccess !== undefined) {
        localStorage.setItem(
          "hasGameAccess",
          response.data.hasGameAccess ? "true" : "false",
        );
      }
      if (response.data.subscriptionType !== undefined) {
        localStorage.setItem(
          "subscriptionType",
          response.data.subscriptionType,
        );
      }
      if (response.data.isProducer !== undefined) {
        localStorage.setItem(
          "isProducer",
          response.data.isProducer ? "true" : "false",
        );
      }

      if (response.data.isSubscribed && response.data.subscriptionExpiry) {
        localStorage.setItem(
          "subscriptionExpiry",
          response.data.subscriptionExpiry,
        );
      }

      // Fetch user profile after login
      fetchUserProfile().catch((err) =>
        console.warn(
          "Profile fetch after login skipped or subscription required",
          err,
        ),
      );

      if (response.data.isProducer) {
        localStorage.setItem(
          "isVerified",
          response.data?.isVerified ? "true" : "false",
        );
        navigate("/dashboard");
      } else if (response.data.isSubscribed) {
        navigate("/profile");
      } else {
        navigate("/profile-locked");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      // toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/users/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // toast.success(response.data.message || "Logout successful.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed.";
      // toast.error(errorMessage);
      throw error;
    } finally {
      // Clear token and credentials client-side under all conditions to comply with specification
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isSubscribed");
      localStorage.removeItem("isProducer");
      localStorage.removeItem("hasGameAccess");
      localStorage.removeItem("subscriptionType");
      localStorage.removeItem("subscriptionExpiry");
      localStorage.removeItem("pending_producer_email");
      localStorage.removeItem("pending_producer_name");
      localStorage.removeItem("isVerified");
      sessionStorage.removeItem("fullname");
      sessionStorage.removeItem("email");
      // localStorage.clear();
      // sessionStorage.clear();

      navigate("/");
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");
      const authHeader = { Authorization: `Bearer ${token}` };

      const sigRes = await axios.post(
        `${baseUrl}api/upload/signatures`,
        { slots: ["profilePicture"] },
        { headers: authHeader },
      );

      if (!sigRes.data.signatures || sigRes.data.signatures.length === 0) {
        throw new Error("Failed to obtain upload signature from server.");
      }

      const sigData = sigRes.data.signatures[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${sigData.resourceType}/upload`;
      const cleanAxios = axios.create();
      const cldRes = await cleanAxios.post(cloudinaryUrl, formData);
      const uploadedUrl: string = cldRes.data.secure_url;

      const res = await axios.post(
        `${baseUrl}api/profile/upload-picture`,
        { imageUrl: uploadedUrl },
        { headers: authHeader },
      );

      setUserProfile((prev: any) =>
        prev ? { ...prev, profilePicture: uploadedUrl } : null,
      );

      return uploadedUrl;
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  const getProfilePicture = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${baseUrl}api/profile/profile-picture`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data?.profilePicture || response.data?.imageUrl || "";
    } catch (error: any) {
      console.error("Failed to fetch profile picture:", error);
      throw error;
    }
  };

  const createExtraProfile = async (name: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/profile/extra-profile`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // toast.success(response.data.message || "Profile created!");
      await fetchUserProfile();
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create profile.";
      // toast.error(errorMessage);
      throw error;
    }
  };

  const fetchUserProfile = async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${baseUrl}api/profile/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = response.data;
      setUserProfile(profileData);
      return profileData;
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      if (error.response?.status === 403) {
        // toast.error("Subscription required to access this route");
        console.error("Subscription required to access this route");
      }
      throw error;
    }
  };

  const fetchUserProfileDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${baseUrl}api/fetchuser/fetchedProfile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message || "Failed to fetch profile details";

      if (status === 404) {
        toast.error("User profile not found");
      } else if (status === 500) {
        toast.error("Server error while fetching profile");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  const resetUserProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/resetprofile/resetProfile`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // toast.success(response.data.message || "Profile reset successfully");
      console.log(response.data.message || "Profile reset successfully");
      return response.data.user;
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message || "Failed to reset profile";

      if (status === 404) {
        toast.error("User or default profile not found");
      } else if (status === 409) {
        toast.error(
          "Cannot reset profile. Original username or email is now in use",
        );
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  const updateProfile = async (data: {
    fullname: string;
    username: string;
    email: string;
    age: number;
  }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${baseUrl}api/updateprofile/updateProfile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data.message || "Profile updated successfully");
      // toast.success(response.data.message || "Profile updated successfully");
      // Fetch user profile after update
      fetchUserProfile().catch((err) =>
        console.warn(
          "Profile fetch after update skipped or subscription required",
          err,
        ),
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message || "Failed to update profile";

      if (status === 400) {
        toast.error("Invalid profile data");
      } else if (status === 409) {
        toast.error("Username or email already in use");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  const resetPassword = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/resetprofile/resetPassword`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(response.data.message || "Password reset successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePassword = async (data: {
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${baseUrl}api/updateprofile/updatePassword`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response.data.message || "Password updated successfully");
      // toast.success(response.data.message || "Password updated successfully");
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message || "Failed to update password";

      if (status === 400) {
        toast.error("Passwords do not match");
      } else if (status === 500) {
        toast.error("Failed to change password");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  // Payment Methods
  const initializeBankPayment = async (
    email: string,
  ): Promise<SubscriptionResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${baseUrl}api/paystack/cardpayment`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Payment initialization failed.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const initializeSubscriptionCard = async (
    email: string,
  ): Promise<SubscriptionResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${baseUrl}api/paystack/bankpayment`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Card payment initialization failed.";
      console.error(errorMessage);
      // toast.error(errorMessage);
      throw error;
    }
  };

  const initializeAccessBankPayment = async (
    email: string,
  ): Promise<SubscriptionResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${baseUrl}api/paystack/bankpayment/accessgame`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Access bank payment initialization failed.";
      console.error(errorMessage);
      // toast.error(errorMessage);
      throw error;
    }
  };

  // Game Methods
  const selectTile = async (
    tileIndex: number,
  ): Promise<TileSelectionResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/games/game/choosetile`,
        { tileIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.slotsLeft !== undefined) {
        setCurrentGame((prev) =>
          prev
            ? {
                ...prev,
                slotsLeft: response.data.slotsLeft,
                balance: response.data.balance,
              }
            : null,
        );
      }

      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to select tile.";

      if (status === 400) {
        toast.error(errMessage || "Invalid tile selection");
      } else if (status === 404) {
        toast.error("No active game session found");
      } else if (status === 500) {
        toast.error("Failed to process tile selection due to server error.");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  const quitGame = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/games/game/quit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;
      toast.success(data.message || "Game quit successfully.");
      setCurrentGame(null);
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to quit game.";

      if (status === 404) {
        toast.error("No active game session found.");
      } else if (status === 500) {
        toast.error("Failed to quit game due to server error.");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  // Messaging Methods
  const getInbox = async (): Promise<Conversation[]> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${baseUrl}api/messages/inbox`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.inbox;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch inbox";

      if (error.response?.status === 500) {
        toast.error("Failed to fetch inbox");
      } else {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };

  const getChat = async (friendId: string): Promise<Message[]> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${baseUrl}api/messages/chat/${friendId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data.chat;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch chat";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const sendMessage = async (
    friendId: string,
    content: string,
  ): Promise<Message> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/messages/send`,
        { friendId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const startGame = async (): Promise<GameSession | null> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        `${baseUrl}api/games/game/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const gameSession = response.data.session;
      setCurrentGame(gameSession);
      toast.success(response.data.message || "Game started successfully!");
      return gameSession;
    } catch (error: any) {
      const status = error.response?.status;
      const errMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to start game.";

      if (status === 400) {
        toast.error("You already have an active game session.");
      } else if (status === 500) {
        toast.error("Failed to start game due to server error.");
      } else {
        toast.error(errMessage);
      }

      throw new Error(errMessage);
    }
  };

  // notificatiion
  const getNotifications = async (): Promise<NotificationsResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${baseUrl}api/messages/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch notifications";

      if (error.response?.status === 500) {
        toast.error("Failed to get notifications");
      } else {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };
  // movies
  const getMovies = async (): Promise<MoviesResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${baseUrl}api/movies`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch movies";

      if (error.response?.status === 500) {
        // toast.error("Failed to get movies");
        console.error("Failed to get movies");
      } else {
        console.error(errorMessage);
        // toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };

  const getMovieById = async (id: string): Promise<Movie> => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(`${baseUrl}api/movies/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch movie details";

      // toast.error(errorMessage);
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // producer
  const applyAsProducer = async (
    data: ProducerApplicationPayload,
  ): Promise<ProducerApplicationResponse> => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${baseUrl}api/users/become-producer`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit producer application";

      if (error.response?.status === 409) {
        toast.error("An application with this email already exists");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(errorMessage);
      }

      throw new Error(errorMessage);
    }
  };

  // Earnings & Withdrawals implementations
  const getProducerEarnings = async (): Promise<EarningsDashboardData> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}api/earnings/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch earnings dashboard.";
      throw new Error(errMsg);
    }
  };

  const getEarningsHistory = async (page = 1, limit = 20): Promise<any> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}api/earnings/history`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch earnings history.";
      throw new Error(errMsg);
    }
  };

  const withdrawEarnings = async (
    data: WithdrawalPayload,
  ): Promise<WithdrawalResponse> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${baseUrl}api/earnings/withdraw`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit withdrawal request.";
      throw new Error(errMsg);
    }
  };

  const getWithdrawalsHistory = async (page = 1, limit = 10): Promise<any> => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}api/earnings/withdrawals`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch withdrawals history.";
      throw new Error(errMsg);
    }
  };

  const getRecentlyPlayed = async (limit = 20) => {
    // Graceful client-side gate check before hitting the server
    if (!userProfile || !userProfile.isSubscribed) {
      return [];
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/movies/premium/recently-played`, {
        params: { limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.recentlyPlayed || [];
    } catch (error: any) {
      console.error("Error fetching recently played movies:", error);
      return [];
    }
  };

  return (
    <ApiContext.Provider
      value={{
        // Authentication
        signup,
        login,
        logout,

        // Payment
        initializeBankPayment,
        initializeSubscriptionCard,
        initializeAccessBankPayment,
        pendingSubscription,
        setPendingSubscription,

        // Profile
        uploadProfilePicture,
        getProfilePicture,
        createExtraProfile,
        fetchUserProfile,
        fetchUserProfileDetails,
        resetUserProfile,
        updateProfile,
        resetPassword,
        updatePassword,
        userProfile,

        // Game
        selectTile,
        quitGame,
        startGame,
        currentGame,

        // Messaging
        getInbox,
        getChat,
        sendMessage,

        // Notification
        getNotifications,

        // Movies
        getMovies,
        getMovieById,
        movieFile,
        setMovieFile,
        trailerFile,
        setTrailerFile,
        posterFile,
        setPosterFile,
        btsFile,
        setBtsFile,
        subtitleFile,
        setSubtitleFile,
        movieMetadata,
        setMovieMetadata,
        publishCompleteMovie,
        resetUploadWizard: clearUploadWizard,
        getPremiers,

        movieFiles: {
          movie: movieFile,
          trailer: trailerFile,
          poster: posterFile,
          bts: btsFile,
          subtitle: subtitleFile,
        },

        // Producer
        applyAsProducer,

        // Earnings & Withdrawals
        getProducerEarnings,
        getEarningsHistory,
        withdrawEarnings,
        getWithdrawalsHistory,

        // Global UI State for Audio
        isAuthFlowActive,
        setIsAuthFlowActive,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
