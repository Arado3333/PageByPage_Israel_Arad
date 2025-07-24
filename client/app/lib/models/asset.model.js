let id = 1;

export default class Asset
{
    constructor(name, type, description)
    {
        this.id = id++;
        this.name = name;
        this.type = type;
        this.description = description;
    }
}