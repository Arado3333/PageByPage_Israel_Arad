import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "..//ui/badge";
import { ArrowLeft } from "lucide-react";
import { deleteFromCloudinary } from "../../lib/actions";

export default function AssetViewer({ asset, book, onBack, onSave }) {
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const updatedBook = { ...book };
            updatedBook.assets = book.assets.filter(
                (assetObj) => assetObj.name !== asset.name
            );
            updatedBook.lastEdited = new Date().toISOString();
            onSave(updatedBook);
            deleteFromCloudinary(asset.url, asset.type);
            onBack();
        }
    };

    // asset: { name, type, description, url }
    const isImage =
        asset?.type?.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(asset?.url);

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <div className="flex justify-end" style={{ alignItems: "flex-start" }}>
                <div className="relative" style={{ top: 0, right: 0 }}>
                    <Button
                        onClick={handleDelete}
                        className="btn-outline error transition-all hover:scale-105 flex-1 sm:flex-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="transition-all hover:scale-105 p-2 text-muted-foreground hover:text-accent"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--foreground)" }}
                >
                    {asset?.name || "Asset"}
                </h1>
                <Badge className="badge-muted ml-2">asset</Badge>
            </div>
            <Card className="card">
                <CardHeader
                    className="border-b mobile-p"
                    style={{ borderColor: "var(--border)" }}
                >
                    <CardTitle style={{ color: "var(--foreground)" }}>
                        Asset Preview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 mobile-p flex flex-col items-center">
                    {isImage ? (
                        <img
                            src={asset.url}
                            alt={asset.name}
                            className="max-w max-h-80 object-contain rounded shadow mb-4"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded shadow mb-4">
                            <span className="text-5xl">📄</span>
                            <span className="text-xs mt-1">
                                {asset.type?.split("/")[1]?.toUpperCase() ||
                                    "FILE"}
                            </span>
                        </div>
                    )}
                    <div className="w-full">
                        <div className="font-semibold mb-2">Description</div>
                        <div className="text-sm text-muted-foreground mb-4">
                            {asset.description || (
                                <span className="italic">No description</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 break-all">
                            <span className="font-medium">URL: </span>
                            <a
                                href={asset.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                {asset.url}
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
