let id = 1;

export default class Character
{
    constructor(name = "New Character", role = "Protagonist", notes = "This is the initial character note")
    {
        this.id = id++;
        this.name = name;
        this.role = role;
        this.notes = notes;
    }
}
