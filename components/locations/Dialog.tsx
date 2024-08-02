import React, { useState, useEffect } from 'react'
import { Paragraph, EntryCard, Stack, List } from '@contentful/f36-components'
import { DialogAppSDK } from '@contentful/app-sdk'
import {
  /* useCMA, */ useSDK,
  useFieldValue,
} from '@contentful/react-apps-toolkit'

import Image from 'next/image'

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>()
  const categories = sdk.parameters.invocation.categoryResults || {}

  // were getting the playlist tracks from the categories object
  const [playlistTracks, setplaylistTracks] = useState([
    categories.playlists.items,
  ])

  const handleSelectedPlaylist = async (playlist) => {
    const image = playlist.images[0].url
    const playlistUrl = playlist.external_urls.spotify

    const arrayOftracks = [image, playlistUrl]

    setplaylistTracks(arrayOftracks)
    // this returns a promise we can catch on Field.tsx
    sdk.close(arrayOftracks)
  }
  return (
    <div>
      <Paragraph style={{ textAlign: 'center' }}>
        {`${categories ? categories.message : 'No tracks available'}`}{' '}
      </Paragraph>
      {categories && (
        <div>
          {categories?.playlists.items.map((categoryResults) => {
            return (
              <div key={categoryResults.id}>
                <EntryCard
                  style={{
                    margin: '5px',
                    padding: '5px',
                  }}
                  title={categoryResults.name}
                  description={`Playlist Description: ${categoryResults.description}`}
                  thumbnailElement={
                    <Image
                      alt='album image'
                      src={categoryResults.images[0].url}
                      width={100}
                      height={100}
                    />
                  }
                  onClick={() => handleSelectedPlaylist(categoryResults)}
                >
                  {categoryResults.name}
                </EntryCard>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dialog
