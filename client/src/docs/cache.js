/*
    anytime the cache changes whether it was changed automatically or manually, the UI updates to reflect the new changes in the cache.

    CAUSES OF CHANGE TO THE CACHE
    1. mutation 
    2. fetch query for the first time. 

your application does not receive information directly from your server, instead the info is sent to apollo-client, who stores it in the cache and from the cache returns it to you via the data object
    for e.g  
    
    const { loading, data = {} } =  useQuery(FETCH_POSTS_QUERY);
    const { loading, data: { getAllPostsFromServer: posts } = {} } =  useQuery(FETCH_POSTS_QUERY);

    const [registerUser, { loading,data }] = useMutation(REGISTER_USER_MUTATION, {
    variables: values,
    }

    the way the apollo client saves the info in cache is in key:value pairs inside the ROOT_QUERY object(we can see it from the apollo chrome extension, under the cache tab)

    KEY is the Query or Mutation resolver function's name, together with the parameters if the resolver function needs it
    VALUE is the returned information from the server. it can be an array or object

    also this cached object will also be monitored by the query whose execution returned it. for e.g getAllPostsFromServer object will be monitored by FETCH_POSTS_QUERY

    QUERIES OR MUTATIONS SENT

    When the a mutation is run such as CREATE_POST, the newly added and returned object from the server is saved into the cache and this cached obj will be monitored by CREATE_POST. The previously cached list of posts objects, being watched by the FETCH_POSTS_QUERY query, is not automatically updated however. This means the FETCH_POSTS_QUERY query isn't notified that a new post was added, which then means the query will not update to show the new post. To address this we're using 
    const oldData = proxy.readQuery({
                        query: FETCH_POSTS_QUERY
                    }) which gives us access to the previously cached list of posts being watched by FETCH_POSTS_QUERY.

    we then call the proxy.writeQuery({
        query:FETCH_POSTS_QUERY,
        data:{
            getAllPostsFromServer:[newPost, ...oldData.getAllPostsFromServer]
        }
    })
    
    then store that reference in the ROOT_QUERY.getAllPostsFromServer array.

Any changes you make to cached data inside of an update function are automatically broadcast to queries that are listening for changes to that data. Consequently, your application's UI will update to reflect newly cached values.

writeQuery or readQuery allows you interact with data saved in the cache. either fetch or change
useQuery or useMutation also fetches data from the cache for you but you can not change the data in the cache using these hooks
*/