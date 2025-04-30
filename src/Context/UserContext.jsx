// import { createContext, useState, useContext, useEffect } from "react";
// import { apiGet } from "../api/apiMethods";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [stats, setStats] = useState(null);
//     const [categories, setCategories] = useState([])
//     const [logoURL, setLogoURL] = useState("")
//     const token = sessionStorage.getItem('accessToken')

//    const initializeUser = async () => {
//     try {
//         const response = await apiGet("api/auth/userInfo");
//         if (response.status === 200 && response.data?.user ) {
//             setUser(response.data.user);
//         } else {
//             const response = await apiGet("api/vendor-info");
//             if (response.status === 200 && response.data?.vendor && response.data.stats) {
//                 setUser(response.data.vendor);
//                 setStats(response.data.stats );
//             }
//         }
//     } catch (error) {
//         console.error("Failed to fetch user data:", error.message);
      
//     }
// };

//     useEffect(() => {
//         if (token) {
//             initializeUser();
//         }
//     }, [token]);


//     useEffect(() => {
//         (async () => {
//             try {
//                 if (!user) return;
//                 const { data } = await apiGet(`api/website/${user.referenceWebsite}`)
//                 setCategories(data.website.categories);
//                 setLogoURL(data.logoUrl);
//             } catch (error) {
//                 console.log(error.message)
//             }
//         })()
//     }, [user])

//     return (
//         <UserContext.Provider value={{ user, stats, setUser, initializeUser, categories, setCategories, logoURL }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export const useUser = () => useContext(UserContext);



import { createContext, useState, useContext, useEffect } from "react";
import { apiGet } from "../api/apiMethods";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [logoURL, setLogoURL] = useState("");
  const token = sessionStorage.getItem("accessToken");

  const initializeUser = async () => {
    try {
      const response = await apiGet("api/auth/userInfo");
      if (response.status === 200 && response.data?.user) {
        setUser(response.data.user);
      } else {
        const vendorResponse = await apiGet("api/vendor-info");
        if (vendorResponse.status === 200 && vendorResponse.data?.vendor) {
          setUser(vendorResponse.data.vendor);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      initializeUser();
    }
  }, [token]);

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        const { data } = await apiGet("api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    const fetchLogo = async () => {
      try {
        const { data } = await apiGet(`api/website/${user.referenceWebsite}`);
        setLogoURL(data.logoUrl);
      } catch (error) {
        console.error("Error fetching logo:", error.message);
      }
    };

    fetchCategories();
    fetchLogo();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        stats,
        setStats,
        categories,
        setCategories,
        logoURL,
        initializeUser, // Now exposed in context
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
