const template = require('./template.js')

module.exports =
{
  render: template(),
  props: {
    for: {
      type: String,
      required: false
    },
    records: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: false,
      default: 25
    },
    chunk: {
      type: Number,
      required: false,
      default: 8
    },
    countText: {
      type: String,
      required: false,
      default: 'Showing {from} to {to} of {count} records|{count} records|One record'
    },
    vuex: {
      type: Boolean
    },
    format: {
      type: Boolean,
      default: true
    }
  },
  created() {
    if (!this.vuex) return

    if (!this.for) {
      throw new Error('vue-pagination-2: The "for" prop is required when using vuex')
    }
  },
  data() {
    return {
      Page: 1
    }
  },
  computed: {
    page() {
      return this.$store.state[this.for].page
    },
    pages() {
      if (!this.records) {
        return []
      }
      return range(this.page, this.pagesInCurrentChunk, this.chunk)
    },
    totalPages() {
      return this.records ? Math.ceil(this.records / this.perPage) : 1
    },
    totalChunks() {
      return Math.ceil(this.totalPages / this.chunk)
    },
    currentChunk() {
      return Math.ceil(this.page / this.chunk)
    },
    paginationStart() {
      return ((this.currentChunk - 1) * this.chunk) + 1
    },
    pagesInCurrentChunk() {
      return this.paginationStart + this.chunk <= this.totalPages ? this.chunk : this.totalPages - this.paginationStart + 1
    },
    count() {
      const from = ((this.page - 1) * this.perPage) + 1
      const to = this.page === (this.totalPages) ? this.records : from + this.perPage - 1
      const parts = this.countText.split('|')
      const i = Math.min(this.records === 1 ? 2 : this.totalPages === 1 ? 1 : 0, parts.length - 1)

      return parts[i].replace('{count}', this.formatNumber(this.records))
        .replace('{from}', this.formatNumber(from))
        .replace('{to}', this.formatNumber(to))
    }
  },
  methods: {
    setPage(page) {
      if (this.allowedPage(page)) {
        this.paginate(page)
      }
    },
    paginate(page) {
      this.$store.dispatch(`${this.for}/paginate`, page)
    },
    next() {
      return this.setPage(this.page + 1)
    },
    prev() {
      return this.setPage(this.page - 1)
    },
    nextChunk() {
      return this.setChunk(1)
    },
    prevChunk() {
      return this.setChunk(-1)
    },
    setChunk(direction) {
      this.setPage((((this.currentChunk - 1) + direction) * this.chunk) + 1)
    },
    allowedPage(page) {
      return page >= 1 && page <= this.totalPages
    },
    allowedChunk(direction) {
      return (direction === 1 && this.currentChunk < this.totalChunks) ||
          (direction === -1 && this.currentChunk > 1)
    },
    allowedPageClass(direction) {
      return this.allowedPage(direction) ? '' : 'disabled'
    },
    allowedChunkClass(direction) {
      return this.allowedChunk(direction) ? '' : 'disabled'
    },
    activeClass(page) {
      return this.page === page ? 'active' : ''
    },
    formatNumber(num) {
      if (!this.format) return num

      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}

function range(page, count, chunk) {
  let begin = page
  let end = page + count
  if (page > chunk) {
    count = (count % 2 === 0) ? count - 1 : count
    begin = page - Math.floor(count / 2)
    end = page + Math.floor(count / 2)
  }
  if (end > this.totalPages) {
    begin = this.totalPages - chunk
  }

  return Array.apply(0, Array(count))
    .map((element, index) => index + begin)
}
