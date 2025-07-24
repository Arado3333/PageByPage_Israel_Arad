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

                characts: book.characts.filter(
                    (char) => char.id !== character.id
                ),
                lastEdited: new Date().toISOString(),
            };

            onSave(updatedBook);
            onBack();
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                {/* Header Section */}
                <div className="flex items-start gap-4 w-full sm:w-auto">
                    <Button variant="ghost" onClick={onBack} className="p-2">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Edit Character: {character.name || "New Character"}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">Character</Badge>
                            {hasChanges && (
                                <Badge variant="destructive">
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-1 sm:flex-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex-1 sm:flex-auto"
                        disabled={!hasChanges}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Character Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {/* Character Name Input */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-2"
                        >
                            Name
                        </label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter character's name"
                        />
                    </div>

                    {/* Character Role Dropdown */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium mb-2"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-transparent"
                        >
                            <option value="">Select role</option>
                            {characterRoleOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() +
                                        option.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Character Notes Textarea */}
                    <div>
                        <label
                            htmlFor="notes"
                            className="block text-sm font-medium mb-2"
                        >
                            Notes
                        </label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Write your character notes here..."
                            rows={15}
                            className="resize-none"
                            style={{ fontFamily: "Georgia, serif" }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Word Count Footer */}
            <div className="mt-4 text-sm text-muted-foreground">
                Word count: {notes.split(/\s+/).filter(Boolean).length}
            </div>
        </div>
    );
}
