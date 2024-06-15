"use client";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const EditCook = ({ id, fetchCooks }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const cities = ["Banglore", "Chennai", "Delhi", "Mumbai", "Kolkata"];
    const cuisinesOptions = ["Bengali", "Chettinad", "Continental", "Mexican", "French", "Hyderabadi"];

    const getCookData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cooks/getCook/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setName(data.data.name || "");
                setMobile(data.data.mobile || "");
                setSelectedOptions(data.data.cuisines || []);
                setCity(data.data.city || "");
                setDescription(data.data.description || "");
            } else {
                throw new Error(data.message || "Failed to fetch cook data");
            }
        } catch (error) {
            console.error("Error fetching cook data:", error);
            toast({
                variant: "destructive",
                description: error.message || "Failed to fetch cook data",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            getCookData();
        }
    }, [open, id]);

    const handleCheckboxChange = (option) => {
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(option) ? prevSelectedOptions.filter((item) => item !== option) : [...prevSelectedOptions, option]
        );
    };

    const handleEditCook = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            name,
            mobile,
            cuisines: selectedOptions,
            city,
            description,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cooks/updateCook/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                fetchCooks();
                setOpen(false);
                toast({
                    variant: "success",
                    description: data.message,
                });
            } else {
                throw new Error(data.message || "Failed to update cook");
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: error.message || "Failed to update cook",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Cook</DialogTitle>
                    <DialogDescription>Update the cook data. Click save when you're done.</DialogDescription>
                </DialogHeader>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader className="animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleEditCook} className="grid w-full items-start gap-6">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">Master Chef</legend>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mobile">Phone</Label>
                                <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cuisines">Cuisines</Label>
                                <Select>
                                    <SelectTrigger id="cuisines">{selectedOptions.length === 0 ? "Select cuisines" : selectedOptions.join(", ")}</SelectTrigger>
                                    <SelectContent>
                                        {cuisinesOptions.map((option) => (
                                            <div key={option} className="flex items-center p-2">
                                                <Checkbox
                                                    id={option}
                                                    checked={selectedOptions.includes(option)}
                                                    onCheckedChange={() => handleCheckboxChange(option)}
                                                />
                                                <Label htmlFor={option} className="ml-2">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Select onValueChange={(value) => setCity(value)} value={city}>
                                    <SelectTrigger id="city">
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((cityOption) => (
                                            <SelectItem key={cityOption} value={cityOption}>
                                                {cityOption}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="You are a..."
                                    className="min-h-[8rem]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </fieldset>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader className="animate-spin" /> : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditCook;
