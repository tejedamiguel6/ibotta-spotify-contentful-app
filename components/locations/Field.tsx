import React, { useState, useEffect } from 'react'
import { Paragraph, Button, EntryCard } from '@contentful/f36-components'
import { FieldAppSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'

type Category = {
  href: string
  icons: Array<{ url: string; height: string; width: string }>
  id: string
  name: string
}

const Field = () => {
  const sdk = useSDK<FieldAppSDK>()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // login in with spotify
  const loginWithSpotify = async () => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    })

    const accessToken = await response.json()
    setToken(accessToken.access_token)
    setLoggedIn(true)
  }

  useEffect(() => {
    if (loggedIn) {
      try {
        const fetchData = async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/browse/categories`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          const data = await response.json()
          console.log('categories-->', data)
          setCategories(data.categories.items)
        }
        fetchData()
      } catch (error) {
        console.log(error)
        setError(error.message)
      }
    }
  }, [loggedIn])

  const handleSelectedCategory = async (category: string) => {
    setSelectedCategory(category)
    const response = await fetch(
      `https://api.spotify.com/v1/browse/categories/${category}/playlists`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const categoryResults = await response.json()

    // console.log('tracks', categoryResults)

    sdk.dialogs
      .openCurrentApp({
        position: 'center',
        title: 'Selected Category',
        minHeight: '50vh',
        allowHeightOverflow: true,
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true,
        parameters: {
          categoryResults,
        },
      })
      .then((result) => {
        const returnedResult = result
        sdk.field.setValue(returnedResult)
      })
  }

  return (
    <>
      {!loggedIn && (
        <>
          <Button onClick={loginWithSpotify}>login with spotify</Button>
        </>
      )}

      {categories
        ? categories.map((category: Category, index) => {
            const image = category.icons[0].url
            return (
              <div key={`${index + 1} +  ${category.id}`}>
                <EntryCard
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: 'rgb(60, 179, 113)' }
                      : undefined
                  }
                  title={category.name}
                  thumbnailElement={<img alt='album image' src={image} />}
                  onClick={() => handleSelectedCategory(category.id)}
                />
              </div>
            )
          })
        : null}
    </>
  )
}

export default Field
