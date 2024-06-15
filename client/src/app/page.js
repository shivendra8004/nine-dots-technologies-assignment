"use client";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import DeleteCook from "@/components/helpers/DeleteCook";
import AddCook from "@/components/helpers/AddCook";
import { toast } from "@/components/ui/use-toast";
import Logout from "@/components/helpers/Logout";
import EditCook from "@/components/helpers/EditCook";

const Page = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [cooks, setCooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCooks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cooks/getAllCooks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setCooks(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getuser/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setUser(data.data);
        } catch (error) {
            console.error(error);
        }
    };

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
                    fetchUserData(data.userId);
                    fetchCooks();
                } else {
                    toast({
                        title: "Token Expired",
                        description: "Please login again to continue",
                        variant: "destructive",
                    });
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error(error);
            }
        };
        verifyUser();
    }, [router]);

    const filteredCooks = cooks.filter((cook) => cook.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 ">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Breadcrumb className="hidden md:flex">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard">All Cooks</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search cooks..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                                {user && <Image src={user?.pic} width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user?.firstName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Logout />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <AddCook fetchCooks={fetchCooks} />
                        </div>
                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cooks</CardTitle>
                                    <CardDescription>Manage your cooks and view their specifications.</CardDescription>
                                </CardHeader>

                                {filteredCooks.length > 0 ? (
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredCooks.map((cook) => (
                                            <Card key={cook._id} className="flex flex-col">
                                                <CardHeader className="flex-grow">
                                                    <CardTitle className="text-xl font-bold truncate">{cook.name}</CardTitle>
                                                    <CardDescription className="text-sm text-gray-600 line-clamp-2">{cook.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex-grow flex flex-col gap-4">
                                                    <div>
                                                        <Label className="text-sm font-semibold mb-2 block">Cuisines</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cook.cuisines.map((cuisine, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs font-normal px-2 py-1">
                                                                    {cuisine}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <Label className="font-semibold block mb-1">City</Label>
                                                            <p className="text-gray-600">{cook.city}</p>
                                                        </div>
                                                        <div>
                                                            <Label className="font-semibold block mb-1">Mobile</Label>
                                                            <p className="text-gray-600">{cook.mobile}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between pt-4 border-t">
                                                    <EditCook id={cook._id} fetchCooks={fetchCooks} />
                                                    <DeleteCook id={cook._id} fetchCooks={fetchCooks} />
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </CardContent>
                                ) : (
                                    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-[60vh]">
                                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                                            <div className="flex flex-col items-center gap-2 text-center ">
                                                <h3 className="text-2xl font-bold tracking-tight">No cooks found</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {searchQuery ? "Try adjusting your search query." : "You can start adding cook using 'Add Cook' button."}
                                                </p>
                                                {!searchQuery && <AddCook fetchCooks={fetchCooks} />}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default Page;
