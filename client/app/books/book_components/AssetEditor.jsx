"use client";

import { useState, useEffect, useActionState } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { uploadAction } from "../../lib/actions.js";
import { useFormStatus } from "react-dom";

export default function AssetEditor({ book, section, onBack, onSave }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    const [file, setFile] = useState(null);
    const bookObj = {...book};
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setHasChanges(true);
    };

    useEffect(() => {
        if (file !== null) {
            console.log(file);
        }
    }, [file]);

    const handleDeleteFile = () => {
        setFile(null);
        setHasChanges(true);
    };

    const [state, uploadAct] = useActionState(uploadAction, undefined);

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
                    {/* Save Button was here */}
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
                    <form action={uploadAct}>
                        {state && state.error}
                        <div>
                            <input
                                hidden={true}
                                id="book"
                                name="book"
                                defaultValue={JSON.stringify(bookObj)}
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium mb-2"
                            >
                                Name
                            </label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter asset name"
                                className="input-field transition-all"
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium mb-2"
                            >
                                Asset Type
                            </label>
                            <select
                                name="assetType"
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
                        <div className="mb-5">
                            <label
                                htmlFor="file"
                                className="block text-sm font-medium mb-2"
                            >
                                Upload File
                            </label>
                            {
                                <Input
                                    type="file"
                                    id="file"
                                    name="uploadFile"
                                    accept="image/*,application/pdf,video/*"
                                    className="input-field transition-all"
                                    onChange={handleFileChange}
                                />
                            }
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium mb-2"
                            >
                                Description
                            </label>
                            <Textarea
                                name="description"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe this asset..."
                                rows={6}
                                className="resize-none input-field transition-all"
                            />
                        </div>
                        <SubmitButtonAsset hasChanges={hasChanges} />
                    </form>
                </CardContent>
                {file && (
                    <div className="p-4 border-t border-gray-200 bg-muted rounded-b-lg mt-2 flex items-center gap-4">
                        <div>
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-24 h-24 object-cover rounded shadow"
                                />
                            ) : file.type.startsWith("video/") ? (
                                <video
                                    src={URL.createObjectURL(file)}
                                    controls
                                    className="w-24 h-24 object-cover rounded shadow"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 rounded shadow">
                                    <span className="text-4xl">📄</span>
                                    <span className="text-xs mt-1">{file.type.split("/")[1]?.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">{file.name}</div>
                            <div className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB &middot; {file.type}
                            </div>
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                    onClick={handleDeleteFile}
                                    type="button"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

function SubmitButtonAsset({ hasChanges }) {
    const { pending } = useFormStatus();

    return (
        <div className="mt-5">
            <Button
                className="btn-primary transition-all hover:scale-105 flex-1 sm:flex-auto"
                disabled={!hasChanges || pending}
            >
                <Save className="w-4 h-4 mr-2" />
                Save
            </Button>
        </div>
    );
}
