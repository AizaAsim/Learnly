import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileLogo from "/img/mobile-logo.svg";

interface ProfileHeaderProps {
    username?: string;
    isMyProfile: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    username,
    isMyProfile
}) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-light-T30 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title Section */}
                    <div className="flex items-center">
                        <MobileLogo />

                        <div className="hidden md:flex ml-2">
                            <h1 className="text-lg font-semibold text-grayscale-90">
                                {isMyProfile ? 'My Profile' : username}
                                {!isMyProfile && username && (
                                    <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accentGold bg-opacity-10 text-accentGold">
                                        Educator                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Back Button for non-myProfile pages */}
                        {!isMyProfile && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-full hover:bg-light-T30 transition-colors text-grayscale-60"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}

                        {/* Navigation Links - Hidden on Mobile */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <NavLink to="/explore" label="Explore" />
                            <NavLink to="/library" label="Library" />
                            <NavLink to="/subscriptions" label="Subscriptions" />
                        </nav>

                        {/* Mobile Title - Only visible on smaller screens */}
                        <div className="md:hidden">
                            <h1 className="text-base font-semibold text-grayscale-90">
                                {isMyProfile ? 'My Profile' : username}
                            </h1>
                        </div>

                        {/* Profile/Settings Menu */}
                        {isMyProfile ? (
                            <Link
                                to="/settings"
                                className="p-2 rounded-full hover:bg-light-T30 transition-colors text-grayscale-70"
                                aria-label="Settings"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button className="py-1.5 px-3 rounded-full text-sm font-medium text-white bg-primaryBlue hover:bg-blue-800 transition-colors">
                                    Follow
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// Helper component for navigation links
const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
    return (
        <Link
            to={to}
            className="text-grayscale-70 hover:text-primaryBlue transition-colors text-sm font-medium"
        >
            {label}
        </Link>
    );
};