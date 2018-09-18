import config from 'config/index'
import { randomItem } from 'services/array-helper'

export function getBackground(artist) {
  if (typeof artist.background !== 'undefined' && artist.background.length > 0) {
    return randomItem(artist.background)
  }
  if (typeof artist.banner !== 'undefined' && artist.banner.length > 0) {
    return randomItem(artist.banner)
  }
  return artist.albumArt
}

export function getCover(artist) {
  if (typeof artist.thumbs !== 'undefined' && artist.thumbs.length > 0) {
    return randomItem(artist.thumbs)
  }
  if (artist.image && artist.image !== '') {
    const url = new URL(artist.image, config.baseUrl)
    url.protocol = 'http:'
    return url
  }
  if (artist.albumArt && artist.albumArt !== '') {
    const url = new URL(artist.albumArt, config.baseUrl)
    url.protocol = 'http:'
    return url
  }
  return config.defaultCover
}

export function getLogo(artist) {
  if (typeof artist.logo !== 'undefined' && artist.logo.length > 0) {
    return randomItem(artist.logo)
  }
  return null
}
