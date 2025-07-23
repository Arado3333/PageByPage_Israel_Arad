export default class Task 
{

    constructor(title, fullTitle, category = "Writing", day, month = new Date().getMonth(), year = new Date().getFullYear())
    {
        this.title = title;
        this.fullTitle = fullTitle;
        this.category = category;
        this.day = day;
        this.month = month;
        this.year = year;
    }
}
