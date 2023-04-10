class Webfeatures {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
    }

    search() {
        const keyword = this.queryParams.keyword ? {
            name: {
                $regex: this.queryParams.keyword,
                $options: "i"
            },
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryParams };
        const unwanted = ["keyword", "page_no", "rows"]
        unwanted.forEach((element) => delete queryCopy[element])

        // price_filter 
        let queryParams = JSON.stringify(queryCopy)
        queryParams = queryParams.replace(/\b(gt|gte|lt|lte)\b/g, (el) => `$${el}`)


        this.query = this.query.find(JSON.parse(queryParams))
        return this
    }

    pagination(rows) {
        const currentPage = Number(this.queryParams.page_no) || 1
        const trim = rows * (currentPage - 1)
        // const trimEnd = trimStart + rows
        this.query = this.query.limit(rows).skip(trim)
        return this
    }
}

module.exports = Webfeatures;

