"use client";
import React from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const Logout = () => {
    const router = useRouter();
    const logout = async () => {
        try {
            await localStorage.removeItem("token");
            toast({
                title: "Success",
                description: "Logout success",
                variant: "success",
            });
            router.push("/auth/login");
        } catch (error) {
            console.log(error);
            toast({
                description: "Failed to logout",
                variant: "destructive",
            });
        }
    };
    return <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>;
};

export default Logout;
