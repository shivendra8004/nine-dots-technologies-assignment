"use client";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const AddCook = ({ fetchCooks }) => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const cities = ["Benglore", "Chennai", "Delhi", "Mumbai", "Kolkata"];
    const cuisinesOptions = ["Bengali", "Chettinad", "Continental", "Mexican", "French", "Hyderabadi"];

    const handleCheckboxChange = (option) => {
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(option) ? prevSelectedOptions.filter((item) => item !== option) : [...prevSelectedOptions, option]
        );
    };

    const validateForm = () => {
        let formErrors = {};
        if (name.length < 3) formErrors.name = "Name must be at least 3 characters long";
        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) formErrors.mobile = "Mobile must be a 10-digit number";
        if (selectedOptions.length === 0) formErrors.cuisines = "At least one cuisine must be selected";
        if (!city) formErrors.city = "City must be selected";
        if (description.length < 5) formErrors.description = "Description must be at least 5 characters long";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddCook = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const formData = {
            name,
            mobile: parseInt(mobile, 10),
            cuisines: selectedOptions,
            city,
            description,
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cooks/addCook`, {
                method: "POST",
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
                setName("");
                setMobile("");
                setCity("");
                setDescription("");
                setSelectedOptions([]);
                toast({
                    variant: "success",
                    description: data.message,
                });
            } else {
                throw new Error(data.message || "Failed to add cook");
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: error.message || "Failed to add cook",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add Cook</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Cook</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAddCook} className="grid w-full items-start gap-2">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">Master Chef</legend>
                        <div className="grid gap-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="mobile">Phone</Label>
                            <Input id="mobile" type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)} />
                            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                        </div>
                        <div className="grid gap-1">
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
                            {errors.cuisines && <p className="text-red-500 text-sm">{errors.cuisines}</p>}
                        </div>
                        <div className="grid gap-1">
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
                            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="You are a..."
                                className="min-h-[6rem]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>
                    </fieldset>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader className="animate-spin" /> : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCook;
