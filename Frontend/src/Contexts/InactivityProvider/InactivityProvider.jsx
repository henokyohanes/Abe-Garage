import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InactivityProvider.module.css";

export const InactivityContext = createContext();

const InactivityProvider = ({ children }) => {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(300);

    const logoutTimer = useRef(null);
    const warningTimer = useRef(null);
    const countdownInterval = useRef(null);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem("user");
        setShowWarning(false);
        clearTimers();
        navigate("/");
    }, [navigate]);


    const resetTimers = useCallback(() => {
        clearTimers();
        setCountdown(300);

        warningTimer.current = setTimeout(() => {
            setShowWarning(true);

            countdownInterval.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 25 * 60 * 1000);

        logoutTimer.current = setTimeout(() => {
            handleLogout();
        }, 30 * 60 * 1000);
    }, [handleLogout]);

    const clearTimers = () => {
        clearTimeout(warningTimer.current);
        clearTimeout(logoutTimer.current);
        clearInterval(countdownInterval.current);
    };

    useEffect(() => {
        const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
        const activityHandler = () => {
            if (localStorage.getItem("user")) {
                setShowWarning(false);
                setCountdown(300);
                clearInterval(countdownInterval.current);
                resetTimers();
            }
        };

        if (localStorage.getItem("user")) {
            resetTimers();
            events.forEach((event) =>
                window.addEventListener(event, activityHandler)
            );
        }

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, activityHandler)
            );
            clearTimers();
        };
    }, [resetTimers]);

    return (
        <InactivityContext.Provider value={{ resetTimers }}>
            {showWarning && (
                <div className={styles.inactivityContainer}>
                    <div className={styles.inactivityBox}>
                        <h2>Inactivity Warning</h2>
                        <p>
                            You’ll be logged out in {Math.floor(countdown / 60)}:
                            {String(countdown % 60).padStart(2, "0")} due to inactivity.
                        </p>
                        <button
                            onClick={() => {
                                setShowWarning(false);
                                setCountdown(300);
                                clearInterval(countdownInterval.current);
                                resetTimers();
                            }}
                        >
                            Stay Logged In
                        </button>
                    </div>
                </div>
            )}
            {children}
        </InactivityContext.Provider>
    );
};

export default InactivityProvider;