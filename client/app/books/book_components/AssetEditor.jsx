"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function AssetEditor({ book, section, onBack, onSave }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (section) {
            setTitle(section.name || "");
            setType(section.type || "");
            setDescription(section.description || "");
        }
    }, [section]);

    useEffect(() => {
        setHasChanges(true);
    }, [title, type, description]);

    const handleSave = () => {
        let updatedSection = {
            ...section,
            name: title,
            type: type,
            description: description,
            lastEdited: new Date().toISOString(),
        };

        let updatedBook = { ...book };
        if (updatedBook.assets) {
            updatedBook.assets = updatedBook.assets.map((item) =>
                item.id === section.id ? updatedSection : item
            );
        }
        onSave(updatedBook);
        setHasChanges(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            const updatedBook = { ...book };
            updatedBook.assets = book.assets.filter(
                (asset) => asset.id !== section.id
            );
            updatedBook.lastEdited = new Date().toISOString();
            onSave(updatedBook);
            if (onBack) onBack();
        }
    };

    const assetTypes = ["image", "document", "audio", "video", "reference"];

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="transition-all hover:scale-105 p-2"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) =>
                            (e.target.style.color = "var(--accent)")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.color = "var(--muted-foreground)")
                        }
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: "var(--foreground)" }}
                        >
                            {section.id ? `Edit Asset` : `New Asset`}:{" "}
                            {section.name || ""}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className="badge-muted">asset</Badge>
                            {hasChanges && (
                                <Badge className="badge-accent">
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                        onClick={handleDelete}
                        className="btn-outline error transition-all hover:scale-105 flex-1 sm:flex-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="btn-primary transition-all hover:scale-105 flex-1 sm:flex-auto"
                        disabled={!hasChanges}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            <Card className="card">
                <CardHeader
                    className="border-b mobile-p"
                    style={{ borderColor: "var(--border)" }}
                >
                    <CardTitle style={{ color: "var(--foreground)" }}>
                        Edit Asset
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6 mobile-p">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-2"
                        >
                            Name
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter asset name"
                            className="input-field transition-all"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium mb-2"
                        >
                            Asset Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 input-field"
                        >
                            <option value="">Select type</option>
                            {assetTypes.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-2"
                        >
                            Description
                        </label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe this asset..."
                            rows={6}
                            className="resize-none input-field transition-all"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
