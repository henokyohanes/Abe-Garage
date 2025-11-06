import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { axiosImageURL, handleProfileImageUpdate } from "../../services/image.service";
import { RiAccountCircleFill } from "react-icons/ri";
import { ScaleLoader } from "react-spinners";
import { FaCamera, FaEdit, FaSignOutAlt } from "react-icons/fa";
// import { toast } from "react-toastify";
import loginService from "../../services/login.service";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Components/AdminMenu/AdminMenu";
import AdminMenuMobile from "../../Components/AdminMenuMobile/AdminMenuMobile";
import Loader from "../../Components/Loader/Loader";
import NotFound from "../../Components/NotFound/NotFound";
import styles from "./Account.module.css";

const Account = () => {
  const [image, setImage] = useState(null);
  const [imgX, setImgX] = useState(0);
  const [imgY, setImgY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploadimage, setUploadimage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const lastTouchDistance = useRef(null);

  // Access the authentication context
  const { isLogged, setIsLogged, user, setUser, isAdmin, isManager } = useAuth();

  // Log out event handler function
  const logOut = async () => {
    await loginService.logOut();
    setIsLogged(false);
    window.location.href = "/";
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const draw = () => {
    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${imgX}px, ${imgY}px) scale(${scale})`;
    }
  };

  useEffect(() => {
    draw();
  }, [imgX, imgY, scale]);

  // Function to handle image drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !imgRef.current || !canvasRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    updateImagePosition(dx, dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Function to update image position
  const updateImagePosition = (dx, dy) => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    const imgWidth = imgRef.current.width * scale;
    const imgHeight = imgRef.current.height * scale;

    const minX = canvasWidth - imgWidth;
    const minY = canvasHeight - imgHeight;

    const newImgX = Math.max(minX, Math.min(0, imgX + dx));
    const newImgY = Math.max(minY, Math.min(0, imgY + dy));

    setImgX(newImgX);
    setImgY(newImgY);
  };

  // Function to handle image zoom
  const handleWheel = (e) => {
    if (!imgRef.current || !canvasRef.current) return;
    e.preventDefault();

    const scaleFactor = e.deltaY < 0 ? 1.05 : 0.95;
    const newScale = Math.max(1, Math.min(scale * scaleFactor, 3));

    setScale(newScale);
  };

  // Add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelWrapper = (e) => handleWheel(e);

    canvas.addEventListener("wheel", handleWheelWrapper, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheelWrapper);
    };
  }, [handleWheel]);

  // Function to handle touch events
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getTouchDistance(e);
      lastTouchDistance.current = dist;
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  // Function to handle touch events
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const newDist = getTouchDistance(e);
      const oldDist = lastTouchDistance.current;
      if (!oldDist) return;

      const delta = newDist / oldDist;
      const newScale = Math.max(1, Math.min(scale * delta, 3));
      setScale(newScale);
      lastTouchDistance.current = newDist;
    } else if (isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;

      updateImagePosition(dx, dy);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
  };

  const getTouchDistance = (e) => {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Function to handle image load
  const handleImageLoad = () => {
    if (imgRef.current && canvasRef.current) {
      const canvasWidth = canvasRef.current.offsetWidth;
      const canvasHeight = canvasRef.current.offsetHeight;
      const centeredX = (canvasWidth - imgRef.current.width) / 2;
      const centeredY = (canvasHeight - imgRef.current.height) / 2;
      setImgX(centeredX);
      setImgY(centeredY);
      setScale(1);
      setIsImageLoaded(true);
    }
  };

  // Function to handle image upload
  const handleUploadClick = async () => {
    if (!isImageLoaded) {
      toast.error("Please select an image before uploading.", {
        autoClose: 1500,
      });
      return;
    }

    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");
    croppedCanvas.width = 250;
    croppedCanvas.height = 250;

    ctx.beginPath();
    ctx.arc(125, 125, 125, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const image = imgRef.current;
    const canvas = canvasRef.current;

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // how much the image is shifted inside the canvas
    const offsetX = imgX;
    const offsetY = imgY;

    const cropX = ((0 - offsetX) / displayWidth) * naturalWidth;
    const cropY = ((0 - offsetY) / displayHeight) * naturalHeight;
    const cropWidth = (canvasWidth / displayWidth) * naturalWidth;
    const cropHeight = (canvasHeight / displayHeight) * naturalHeight;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      croppedCanvas.width,
      croppedCanvas.height
    );

    // Convert the cropped canvas to a blob
    croppedCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "croppedImage.png");

      // Append only the defined email
      if (user.employee_email) {
        formData.append("employee_email", user.employee_email);
      } else if (user.customer_email) {
        formData.append("customer_email", user.customer_email);
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        setLoading(true);
        setError(false);

        const response = await handleProfileImageUpdate(formData);

        // Update the user's profile image
        if (response.profileImage) {
          setUser((prevuser) => ({
            ...prevuser,
            employee_profile_picture: response.profileImage,
          }));
        }

        setUploadimage(false);
        // toast.success("Image uploaded successfully", { autoClose: 1500 });
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error.response) {
          // toast.error("Error uploading image", { autoClose: 1500 });
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  const handleZoomOut = () => {
    setScale((prev) => Math.max(MIN_SCALE, prev - 0.01));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(MAX_SCALE, prev + 0.01));
  };

  const handlePicture = () => setUploadimage(true);
  const handleCancelClick = () => setUploadimage(false);

  const handleEdit = () => {
    if (user.customer_email) return navigate(`/edit-customer/${user.customer_id}`);
    if (user.employee_email) return navigate(`/edit-employee/${user.employee_id}`);
  };

  console.log(user);

  return (
    <Layout>
      <div className={`${styles.provideServices} row g-0`}>
        <div className="d-none d-md-block col-3">
          <AdminMenu />
        </div>
        <div className="d-block d-md-none">
          <AdminMenuMobile />
        </div>
        <div className="col-12 col-md-9">
          {!loading && !error ? (
            <div className={styles.accountContainer}>
              <div className={styles.profile}>
                {!uploadimage ? (
                  <div className={styles.profileDetails}>
                    <h2>
                      Profile Details <span>______</span>
                    </h2>
                    <div className={styles.profileContainer}>
                      <div
                        className={styles.profileImgWrapper}
                        onClick={handlePicture}
                      >
                        <div className={styles.profileImage}>
                          {user?.employee_profile_picture ||
                            user?.customer_profile_picture ? (
                            <img
                              src={`${axiosImageURL}${user?.employee_profile_picture ||
                                user?.customer_profile_picture
                                }`}
                              alt={"Profile Image"}
                              loading="lazy"
                            />
                          ) : (
                            <RiAccountCircleFill
                              className={styles.profileIcon}
                            />
                          )}
                        </div>
                        <div className={styles.profileCamera}>
                          <FaCamera className={styles.cameraIcon} />
                        </div>
                      </div>
                      {/* <canvas ref={canvasRef} style={{ display: "none" }} /> */}
                    </div>
                    <div className={styles.profileLabel}>
                      <div>
                        <p>Username</p>
                        <p>Full Name</p>
                        <p>Phone number</p>
                        <p>Email address</p>
                      </div>
                      <div className={styles.profileInfo}>
                        <strong>
                          - {user?.employee_username || user?.customer_username}
                        </strong>
                        <strong>
                          -{" "}
                          {user?.employee_first_name ||
                            user?.customer_first_name}{" "}
                          {user?.employee_last_name || user?.customer_last_name}
                        </strong>
                        <strong>
                          -{" "}
                          {user?.employee_phone || user?.customer_phone_number}
                        </strong>
                        <strong>
                          - {user?.employee_email || user?.customer_email}
                        </strong>
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      <button
                        onClick={() =>
                          handleEdit(user?.employee_id || user?.customer_id)
                        }
                      >
                        <span className={styles.icon}>
                          <FaEdit />
                        </span>
                        Edit Profile
                      </button>
                      <button onClick={logOut}>
                        <span className={styles.icon}>
                          <FaSignOutAlt />
                        </span>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.profileUpload}>
                    <h2>
                      Upload an Image <span>______</span>
                    </h2>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    <div
                      className={styles.canvasContainer}
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {image && (
                        <img
                          ref={imgRef}
                          src={image}
                          onLoad={handleImageLoad}
                          loading="lazy"
                          style={{
                            position: "absolute",
                            transformOrigin: "top left",
                          }}
                          alt="Uploaded"
                        />
                      )}
                    </div>
                    <div className={styles.zoomSliderContainer}>
                      <button
                        onClick={handleZoomOut}
                        disabled={scale <= MIN_SCALE}
                      >
                        -
                      </button>
                      <input
                        type="range"
                        id="zoomRange"
                        min="1"
                        max="3"
                        step="0.01"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className={styles.zoomSlider}
                      />
                      <button
                        onClick={handleZoomIn}
                        disabled={scale >= MAX_SCALE}
                      >
                        +
                      </button>
                    </div>
                    <div className={styles.buttonsContainer}>
                      <button
                        onClick={handleCancelClick}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUploadClick}
                        className={styles.uploadBtn}
                      >
                        {loading ? (
                          <ScaleLoader color="#fff" height={12} />
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : error ? (
            <NotFound />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;