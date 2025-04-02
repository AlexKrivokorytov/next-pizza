import React from "react";

interface TopBarProps {
	className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className }) => {
	return (
		<div className={cn('sticky top-0 z-10 bg-white py-5 shadow-lg shadow-black/5', className)}></div>
	);
}