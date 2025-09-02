"use client";

import { useState, useEffect } from "react";
import { Button } from "../../books/ui/button";
import { Input } from "../../books/ui/input";
import { Textarea } from "../../books/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../books/ui/card";
import { Badge } from "../../books/ui/badge";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Character from "../../lib/models/character.model.js";

export default function CharacterEditor({ book, character, onBack, onSave }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const characterRoleOptions = [
    "protagonist",
    "antagonist",
    "supporting",
    "minor",
  ];

  useEffect(() => {
    if (character) {
      console.log(character);

      setName(character.name || "");
      setRole(character.role || "");
      setNotes(character.notes || "");
      setHasChanges(false);
    }
  }, [character]);

  useEffect(() => {
    if (character) {
      const nameChanged = name !== (character.name || "");
      const roleChanged = role !== (character.role || "");
      const notesChanged = notes !== (character.notes || "");
      setHasChanges(nameChanged || roleChanged || notesChanged);
    }
  }, [name, role, notes, character]);

  const handleSave = () => {
    const updatedCharacter = new Character(name, role, notes);
    updatedCharacter.lastEdited = new Date().toISOString();

    const updatedBook = {
      ...book,
      characts: book.characts.map((char) =>
        char.id === character.id ? updatedCharacter : char
      ),

      lastEdited: new Date().toISOString(),
    };

    onSave(updatedBook);
    setHasChanges(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      const updatedBook = {
        ...book,

        characts: book.characts.filter((char) => char.id !== character.id),
        lastEdited: new Date().toISOString(),
      };

      onSave(updatedBook);
      onBack();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Decorative Background Blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-200 to-rose-300 blur-3xl opacity-20" />
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
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1 text-sm mb-4">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Character Editor
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0F1A2E] mb-2">
                Edit Character: {character.name || "New Character"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-2 py-1 text-xs">
                  Character
                </Badge>
                {hasChanges && (
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1 text-xs">
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleDelete}
                variant="outline"
                className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-pink-700 to-rose-700 hover:from-pink-800 hover:to-rose-800 text-white border-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </section>

        {/* Form Card */}
        <Card className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-pink-300 to-rose-500" />
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-slate-800">Character Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Character Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character's name"
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              />
            </div>

            {/* Character Role Dropdown */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
              >
                <option value="">Select role</option>
                {characterRoleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Character Notes Textarea */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Notes
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your character notes here..."
                rows={15}
                className="w-full p-4 text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 resize-none"
                style={{ fontFamily: "Georgia, serif" }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Word Count Footer */}
        <div className="mt-4 text-sm text-slate-600">
          Word count: {notes.split(/\s+/).filter(Boolean).length}
        </div>
      </div>
    </div>
  );
}
