"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/verify-token`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    router.push("/");
                } else {
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        };
        verifyUser();
    }, [router]);

    const handleFormSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!validateForm()) return;

        const formData = {
            firstName,
            lastName,
            email,
            password,
        };
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.message) {
                setLoading(false);
                toast({
                    description: data.message,
                });
            }
            if (data.ok) {
                setLoading(false);
                router.push("/auth/login");
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: "Error",
                description: "Unable to create an account",
            });
            console.error(error);
        }
    };

    const validateForm = () => {
        if (firstName.length < 3) {
            toast({ title: "Error", description: "First name must be at least 3 characters long", variant: "destructive" });
            setLoading(false);
            return false;
        }
        if (lastName.length < 3) {
            toast({ title: "Error", description: "Last name must be at least 3 characters long", variant: "destructive" });
            setLoading(false);
            return false;
        }
        if (!email.includes("@")) {
            toast({ title: "Error", description: "Email must be valid", variant: "destructive" });
            setLoading(false);
            return false;
        }
        if (password.length < 5) {
            toast({ title: "Error", description: "Password must be at least 5 characters long", variant: "destructive" });
            setLoading(false);
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 6 characters"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {loading ? <Loader className="animate-spin" /> : "Create an account"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
