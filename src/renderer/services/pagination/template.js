
module.exports = function () {
  return function (h) {
    const items = []

    // eslint-disable-next-line array-callback-return
    this.pages.map(page => {
      items.push(h(
        'li',
        { class: `page-item ${this.activeClass(page)}` },
        [h(
          'a',
          {
            class: 'page-link',
            attrs: {
              role: 'button',
              href: '#'
            },
            on: {
              click: this.setPage.bind(this, page)
            }
          },
          [page]
        )]
      ))
    })

    return h(
      'div',
      { class: 'pager' },
      [h(
        'ul',
        {
          directives: [{
            name: 'show',
            value: this.totalPages > 1
          }],

          class: 'pagination'
        },
        [h(
          'li',
          { class: ` page-item prev-chunk ${this.allowedChunkClass(-1)}` },
          [h(
            'a',
            {
              class: 'page-link',
              attrs: {
                href: '#'
              },
              on: {
                click: this.setChunk.bind(this, -1)
              }
            },
            [h('i', { class: 'material-icons' }, 'first_page')]
          )]
        ), h(
          'li',
          { class: ` page-item prev-page ${this.allowedPageClass(this.page - 1)}` },
          [h(
            'a',
            {
              class: 'page-link',
              attrs: {
                href: '#'
              },
              on: {
                click: this.prev.bind(this)
              }
            },
            [h('i', { class: 'material-icons' }, 'chevron_left')]
          )]
        ), items, h(
          'li',
          { class: ` page-item next-page ${this.allowedPageClass(this.page + 1)}` },
          [h(
            'a',
            {
              class: 'page-link',
              attrs: {
                href: '#'
              },
              on: {
                click: this.next.bind(this)
              }
            },
            [h('i', { class: 'material-icons' }, 'chevron_right')]
          )]
        ), h(
          'li',
          { class: ` page-item next-chunk ${this.allowedChunkClass(1)}` },
          [h(
            'a',
            {
              class: 'page-link',
              attrs: {
                href: '#'
              },
              on: {
                click: this.setChunk.bind(this, 1)
              }
            },
            [[h('i', { class: 'material-icons' }, 'last_page')]]
          )]
        )]
      ), h(
        'p',
        {
          directives: [{
            name: 'show',
            value: parseInt(this.records, 10)
          }],

          class: 'count'
        },
        [this.count]
      )]
    )
  }
}
