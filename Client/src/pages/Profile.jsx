import {  useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { SIGN_OUT } from "../utils/mutations";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {GET_USER_BY_ID } from "../utils/queries";
import {UPDATE_USER } from "../utils/mutations";
import Auth from '../utils/auth';
import DragDrop from '../components/DragDrop';


export default function Profile({ onLogout }) {
  const { userId } = useParams();
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId },
  });
  const navigate = useNavigate();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPfp, setIsEditingPfp] = useState(false);
  const [newName, setNewName] = useState(data?.oneUser?.userName || '');
  const [newPassword, setNewPassword] = useState(null);
  const [newPfp, setNewPfp] = useState(null);
  const [showDragDrop, setShowDragDrop] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  
  const [updateUser] = useMutation(UPDATE_USER);
    

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: () => {      
      onLogout(); 
    },
    onError: (err) => {
      console.error("Logout error:", err);
    },
  });
  
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Set all relevant editing states to false when Enter is pressed
      // You might refine this logic later if needed
      setIsEditingName(false);
      setIsEditingPassword(false);
      // setIsEditingPfp(false); // Pfp editing seems handled differently via DragDrop cancel
    }
  };
  const handleEditPfpClick = () => {
    setIsEditingPfp(true);
  };

  const handleEditPasswordClick = () => {
    setIsEditingPassword(true);
  };
  
  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  
  const handleFileChange = async (file) => {
    try {
      const profile = Auth.getProfile();
      const userId = profile.data._id;
  
      // Compress and optimize image
      const optimizeImage = async (base64Str, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Str;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
  
            // Resize logic
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
  
            // Use lower quality and smaller size
            const optimizedBase64 = canvas.toDataURL('image/webp', 0.5);
            resolve(optimizedBase64);
          };
        });
      };
  
      const optimizedImage = file.base64 
        ? await optimizeImage(file.base64) 
        : null;
  
      updateUser({
        variables: {
          userId: userId,
          pfp: optimizedImage // Optimized, compressed image
        }
      });
      setIsEditingPfp(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  






  const handleSaveEdit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!Auth.loggedIn()) {
      return;
    }

    if (newPassword && newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    const profile = Auth.getProfile();
    const userId = profile.data._id;
  
    try {
      const updateResponse = await updateUser({
        variables: {
          userId: userId,
          userName: newName,
          password: newPassword, 
          
        }
      });
  
      // Optional: Add success feedback or navigation
      setIsEditingPassword(false);
      setIsEditingName(false);
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching profile: {error.message}</p>;

  

  return (
    <div>
      {/* pfp and userName */}
      <h1 className="flex justify-center mb-8">Hello {data.oneUser.userName}!</h1>
      <div className="flex justify-center">
      <button onClick={() => {
        handleEditPfpClick();
        setShowDragDrop(true);
      }}>
          <div className="profilepic border-2 test2">
            {/* Use newPfp if available, otherwise use existing profile picture */}
            <img 
              className="profilepic__image" 
              src={newPfp || data.oneUser.pfp} 
              alt="Profile" 
            />
            <div className="profilepic__content">
              <span className="profilepic__text">Edit Profile Picture</span>
            </div>
          </div>
        </button> 
      </div>
      <div className="flex justify-center">
        
      {isEditingPfp ? (
        <div className="flex justify-center">
          {showDragDrop && (
      <DragDrop
        showPreview={false}
        onFileChange={(fileInfo) => {
          if (fileInfo && fileInfo.base64) {
            setNewPfp(fileInfo.base64);
            handleFileChange(fileInfo);
          }
        }}
        onCancel={() => {
          setShowDragDrop(false);
          setIsEditingPfp(false);
          setNewPfp(null);
          setFileInfo(null);
        }}
      />
    )}
 </div>


      
      ) : (
      <div></div>
      )}
        
        
      </div>

      

      <div className="border-3 border-2 test2 rounded-2xl mt-6">
      {isEditingName ? (
  <div className="w-full px-4 mt-6">
    <form 
      className="border-2 test2 shadow-md rounded-lg p-4 max-w-md mx-auto" 
      onSubmit={handleSaveEdit}
    >
      <div className="mb-4">
        <input 
          type="text" 
          className="w-full px-3 py-2 t border-2 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New Username" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex justify-between space-x-2">
        <button 
          type="submit" 
          className="flex-1 accent text-black py-2 rounded-md transition"
        >
          Update
        </button>
        <button 
          type="button"
          className="flex-1 bg-black t py-2 rounded-md  transition"
          onClick={() => {setIsEditingName(false)}}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
) : (
  <div className="flex justify-between  items-center px-4 py-3 test shadow-sm">
    <span className="text-lg">Username: {data.oneUser.userName}</span>
    <button 
      onClick={handleEditNameClick} 
      className=" bg-black t px-3 py-1 rounded-md text-sm"
    >
      Edit
    </button>
  </div>
)}


{isEditingPassword ? (
  <div className="w-full px-4 mt-6">
    <form 
      className="border-2 test2 shadow-md rounded-lg p-4 max-w-md mx-auto" 
      onSubmit={handleSaveEdit}
    >
      <div className="mb-4">
        <input 
          type="password" 
          className="w-full px-3 py-2 t bg-black border rounded-md focus:outline-none focus:ring-2 "
          placeholder="New Password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="flex justify-between space-x-2">
        <button 
          type="submit" 
          className="flex-1 accent text-black py-2 rounded-md  transition"
        >
          Update
        </button>
        <button 
          type="button"
          className="flex-1 bg-black t py-2 rounded-md hover:bg-gray-300 transition"
          onClick={() => {setIsEditingPassword(false)}}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
) : (
  <div className="flex justify-between items-center px-4 py-3 test shadow-sm">
    <span className="text-lg">Password: ********</span>
    <button 
      onClick={handleEditPasswordClick} 
      className="bg-black t px-3 py-1 rounded-md text-sm"
    >
      Edit
    </button>
  </div>
)}
        
        
      </div>
      <div className="flex justify-center mt-10  rounded-lg overflow-hidden 
            transition duration-300 ease-in-out 
            transform active:scale-95 
            hover:shadow-lg">
        <button onClick={()=> navigate(`/Log/${userId}`)} className="py-6 px-20 mt-6 rounded-full  test border-2 test2">Calendar/Log</button>
      </div>

      <div>
      <div className="px-2 sm:px-4 ">
  <h1 className="text-xl sm:text-2xl font-bold text-center mt-6 mb-4 t">Your Fitness Journey</h1>
  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 ">
    {data.oneUser.completedRegiments.filter(regiment => regiment.progressPic).length > 0 ? (
      data.oneUser.completedRegiments
        .filter(regiment => regiment.progressPic)
        .map((regiment, index) => (
          <div 
            key={index} 
            className="test2 shadow-md rounded-lg overflow-hidden 
            transition duration-300 ease-in-out 
            transform active:scale-95 
            hover:shadow-lg mb-10"
          >
            <div className="relative aspect-square">
              <img
                src={regiment.progressPic}
                alt={`Progress pic for ${regiment.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 sm:p-3 test">
              <p className="text-xs sm:text-sm font-semibold truncate t">
                {regiment.name}
              </p>
              <p className="text-xs sm:text-sm t break-words whitespace-normal">
                {regiment.date}
              </p>
            </div>
          </div>
        ))
    ) : (
      <div className="text-center text-gray-500 mt-6 px-4 col-span-full">
        <p className="text-sm">No progress pictures uploaded yet.</p>
        <p className="text-xs mt-2">Complete a regiment and upload a progress pic!</p>
      </div>
    )}
  </div>
</div>
      </div>
    </div>
  );
}
