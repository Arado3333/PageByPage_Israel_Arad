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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Decorative Background Blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-amber-200 to-orange-300 blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-200 to-violet-300 blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-200 to-teal-300 blur-3xl opacity-15" />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl relative z-10">
        {/* Hero Section */}
        <section className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-sm mb-4">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Asset Viewer
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                  {asset?.name || "Asset"}
                </h1>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs">
                  Asset
                </Badge>
              </div>
            </div>
            <Button
              onClick={handleDelete}
              className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </section>
        <Card className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-amber-300 to-orange-500" />
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-slate-800">Asset Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 flex flex-col items-center">
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
                  {asset.type?.split("/")[1]?.toUpperCase() || "FILE"}
                </span>
              </div>
            )}
            <div className="w-full">
              <div className="font-semibold mb-2 text-slate-800">
                Description
              </div>
              <div className="text-sm text-slate-600 mb-4">
                {asset.description || (
                  <span className="italic">No description</span>
                )}
              </div>
              <div className="text-xs text-slate-500 break-all">
                <span className="font-medium">URL: </span>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-600 transition-colors duration-200"
                >
                  {asset.url}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
