"use client";
import React, { useState } from "react";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

const DeleteCook = ({ id, fetchCooks }) => {
    const [loading, setLoading] = useState(false);
    const handleDeleteCook = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/cooks/deleteCook/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                toast({
                    variant: "success",
                    description: data.message,
                });
                fetchCooks();
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error deleting cook:", error);
            toast({
                variant: "destructive",
                description: "Unable to delete cook",
            });
        }
    };
    return <Button onClick={() => handleDeleteCook(id)}>{loading ? <Loader className="animate-spin" /> : "Delete"}</Button>;
};

export default DeleteCook;
