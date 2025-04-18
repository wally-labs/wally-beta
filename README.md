# Wally

Wally is a relationship wellness chatbot powered by a fine-tuned openAI model. Wally provides contextual responses tailored towards Singlish & Chinese users. Check out our MVP at the release link below!

## TO-DO LIST

- [ ] front-end

  - [x] create home/chat/login pages
  - [x] personify home page (can be improved) - more relatable ui
  - [x] fix chat page ui
  - [x] update sidebar ui, completely hidden
  - [x] personify sidebar ui + classify by relationship maybe(?) (CAN be improved)
  - [x] create plans page
  - [x] create popup ui to be used throughout site for errors/successes etc..
  - [x] create update profile dialog box component
  - [x] create one form component to be used across create-profile and update-profile
  - [x] map each message from openai/user message to a chatmessage component, and improve scrollbox
  - [ ] link user session to jotai state (currently using localStorage)
  - [ ] add image/pdf upload functionality (uploads from device/gdrive/dropbox)
  - [ ] updateProfile functionality (birthdate and heartLevel does not render default value)
  - [ ] update frontEnd to show 3 different dropdowns for responses

- [ ] UI/UX

  - [ ] make sure ui for all pages is 100vh
  - [ ] fix create-chat page ui (languages currently greyed out)
  - [ ] make sure scroll area in chat page sticks to the bottom
  - [ ] chat area has a down button to scroll down
  - [ ] make ui mobile friendly

- [x] correct client side auth errors (import session from clerk not next-auth)

- [ ] auth + trpc

  - [x] fix login page ui (just styling)
  - [x] remove user id input from all routes use id from ctx.session
  - [x] seed current users into vercel db
  - [x] user with no plan is rerouted to "/plans" page when navigating to 'new chat'
  - [x] update clerk webhooks to send data to vercel db (for production do manually depending on external account)
  - [x] procedure to update chats's updatedAt (arrange chats by updatedAt, not createdAt)
  - [ ] convert all restricted value fields to enums
  - [ ] update config.ts/index.ts and src/api/auth (not for demo, read up!)
  - [ ] convert to personal providers for auth

- [x] profile

  - [x] customised user settings page (optional)
  - [x] chat/profile configuration button and popup
  - [x] route to new chat page when profile is created
  - [x] create updateProfile route, only updates necessary info
  - [x] delete chat functionality + add to frontend

- [ ] homepage + chat headers

  - [x] test chatHeaders routes
  - [x] figure out best routing conventions
  - [x] route createChat to new page with the chat once complete
  - [x] create chat scrollbox
  - [ ] chat headers route only called once during login, or after create-chat invocation (not for demo)

- [ ] openAI API (text-to-text)

  - [x] system prompt optimization (can be improved)
  - [x] write sendMessage route
  - [x] test sendMessage call to openAI and check response
  - [x] stream ai responses
  - [x] queries messages are added to the Messages object to send to OpenAI
  - [x] add function to stop request, and retry on error
  - [x] structure response object so that we can personalize output
  - [ ] implement RAG (data flow issues) + Pinecone
  - [ ] indiv pinecone namespace for each user -> id prefixes for each profile
  - [ ] return multiple responses before beta release (completion.choices[0,1,2..]?)
  - [ ] add error handling, cancelling & regeneration to UI using vercel SDK
  - [x] optimize speed and payload size
  - [ ] add context window library and tokenizer, figure out embedding
  - [ ] able to send image/pdf upload capabilities

### OPTIMIZATION

- [ ] optimize "use client" boundaries to for less CSR
- [ ] optimization testing (w/ react-scan)

  - [ ] minimize rerenders
  - [ ] use different types of queries
  - [ ] try abort controller

- [x] integrate global state management - jotai (atomic state)

  - [x] store all chatHeader data (everyth except messages)
  - [x] use atomic state for chatHome page
  - [x] sort (according to updatedAt) before displaying chatData on frontend
  - [x] useEffect in app sidebar handles all:
    - [x] update profile -> updates focusedChatData atom (useEffect in app-sidebar)
    - [x] delete profile -> removes ref to focusedChatData atom
    - [x] user sends message -> update updatedAt of focusedChatData atom

- [ ] separate dbs for production and dev (w/ vercel - paid, not for demo)
- [ ] check auth caching state (not for demo?)
- [ ] error logging (w/ axiom - paid) (not for demo)
- [ ] error management (w/ sentry)
- [ ] routing pages (parallel routes)
- [ ] set up analytics (w/ posthog maybe highlight?)
- [ ] payment processing + webhooks (w/ stripe)
- [ ] language option (expand wally ai to be able to give answers in different languages)

### POST-PRODUCTION

- [ ] migrate from pinecone db to milvus once we start to scale
- [ ] migrate from vercel hosting to ...
