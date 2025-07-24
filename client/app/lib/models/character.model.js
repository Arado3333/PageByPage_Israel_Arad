
export default class Character
{
    static id = 1;

    constructor(name = "New Character", role = "Protagonist", notes = "This is the initial character note")
    {
        this.id = Character.id++;
        this.name = name;
        this.role = role;
        this.notes = notes;
    }
}
