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
  const bookObj = { ...book };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Decorative Background Blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-amber-200 to-orange-300 blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-200 to-violet-300 blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-200 to-teal-300 blur-3xl opacity-15" />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-sm mb-4">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Asset Editor
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                {section.id ? `Edit Asset` : `New Asset`}: {section.name || ""}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs">
                  Asset
                </Badge>
                {hasChanges && (
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs">
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleDelete}
            className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Card className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-amber-300 to-orange-500" />
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-slate-800">Edit Asset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
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
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
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
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
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
                    className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
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
                  className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
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
                    <span className="text-xs mt-1">
                      {file.type.split("/")[1]?.toUpperCase()}
                    </span>
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
    </div>
  );
}

function SubmitButtonAsset({ hasChanges }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5">
      <Button
        className="px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasChanges || pending}
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
