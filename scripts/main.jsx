spotifyApi.token = 'BQAfHIO-DYrIz-5Mh7OBiHOVLQ5d9u8HGctWfkxl-wB3JQFT-colB6GGm35E8NzYEcR3XiZptJ8j3CxysZqbOEB2JgxjbOpqnjYsUUSUjUnsObpwQwIxjYqq744Dvif0pTCFXybCPOQOkQ'



function Feedback({ message, level }) {
    return <section className={`feedback ${level ? `feedback--${level}` : ''}`}>{message}</section>
}



class App extends React.Component {

    state = {

        loginFeedback: '',
        registerFeedback: '',
        searchFeedback: '',
        ArtistList: [],
        AlbumList: [],
        TrackList: [],
        Track: [],
        loginVisible: true,
        registerVisible: false,
        searchPanelVisible: false,
        artistListVisible: false,
        albumListVisible: false,
        trackListVisible: false,
        trackVisible: false

    }

    handleLogin = (email, password) => {
        try {
            logic.login(email, password, user => {
                console.log(user)

                this.setState({ loginFeedback: '' })
                this.setState({ searchPanelVisible: true })
                this.setState({ loginVisible: false })
            })
        } catch ({ message }) {
            this.setState({ loginFeedback: message })
        }
    }


    handleRegister = (name, surname, email, password, passwordConfirmation) => {


        try {

            logic.register(name, surname, email, password, passwordConfirmation, () => {
                this.setState({ registerFeedback: '' })
                this.goToLogin();

            })


        } catch ({ message }) {

            this.setState({ registerFeedback: message })

        }


    }



    handleSearch = (query) => {


        try {

            logic.searchArtists(query, (error, ArtistList) => {
                if (error) console.error(error)
                else {
                    this.setState({ searchFeedback: '', ArtistList, artistListVisible: true,albumListVisible:false,trackListVisible:false })

                }
            })


        } catch ({ message }) {

            this.setState({ searchFeedback: message })

        }


    }


    Logout = () => {
        this.setState({ loginVisible: true })
        this.setState({ searchPanelVisible: false, artistListVisible: false, albumListVisible: false, trackListVisible: false, trackVisible: false })

    }

    ClearLists = () => {

        this.setState({ artistListVisible: false, albumListVisible: false, trackListVisible: false, trackVisible: false, searchFeedback:'' })

    }

    goToRegister = () => {

        console.log(this.state)
        this.setState({ loginVisible: false })
        this.setState({ registerVisible: true })


    }
    goToLogin = () => {

        this.setState({ loginVisible: true })
        this.setState({ registerVisible: false })


    }
    goBackToArtistList = () => {

        this.setState({ albumListVisible: false, artistListVisible: true })

    }

    goBackToAlbumList = () => {

        this.setState({ trackListVisible: false, albumListVisible: true })

    }



    LoadAlbums = (id) => {

        try {

            logic.retrieveAlbums(id, (error, AlbumList) => {
                if (error) console.error(error)
                else {
                    this.setState({ AlbumList, albumListVisible: true, artistListVisible: false })
                    console.log(AlbumList)

                }

            })

        } catch (err) {



        }
    }

    LoadTracks = (id) => {

        try {

            logic.retrieveTracks(id, (error, TrackList) => {
                if (error) console.error(error)
                else {
                    this.setState({ TrackList, trackListVisible: true, albumListVisible: false })
                    console.log(TrackList)

                }

            })

        } catch (err) {



        }
    }
    LoadTrack = (id) => {

        try {

            logic.retrieveTrack(id, (error, Track) => {
                if (error) console.error(error)
                else {
                    this.setState({ Track, trackVisible: true })
                    console.log(this.state.Track)

                }

            })

        } catch (err) {



        }
    }

    render() {

        const { state: { loginFeedback, registerFeedback, searchFeedback, loginVisible, registerVisible, searchPanelVisible, ArtistList, AlbumList, TrackList, Track, artistListVisible, albumListVisible, trackListVisible, trackVisible }, handleLogin, handleRegister, handleSearch, goToLogin, goToRegister, Logout, LoadAlbums, LoadTracks, LoadTrack, goBackToAlbumList, goBackToArtistList, ClearLists } = this

        return <main className='app'>
            <header className="header">
                <h1>Spotifury</h1>
            </header>


            {loginVisible && <LoginPanel onLogin={handleLogin} feedback={loginFeedback} goToRegister={goToRegister} />}
            {registerVisible && <RegisterPanel onRegister={handleRegister} feedback={registerFeedback} goToLogin={goToLogin} />}
            {searchPanelVisible && <SearchPanel onClear={ClearLists} onSearch={handleSearch} feedback={searchFeedback} goToLogout={Logout} />}
            {artistListVisible && <ArtistsPanel artistList={ArtistList} onArtistSelect={LoadAlbums} />}
            {albumListVisible && <AlbumsPanel goToArtists={goBackToArtistList} albumList={AlbumList} onAlbumSelect={LoadTracks} />}
            {trackListVisible && <TrackListPanel goToAlbums={goBackToAlbumList} trackList={TrackList} onTrackSelect={LoadTrack} />}
            {trackVisible && <TrackPanel track={Track} />}






        </main>
    }


}

class LoginPanel extends React.Component {

    state = {

        email: '',
        password: ''


    }

    handleEmailInput = event => this.setState({ email: event.target.value })
    handlePasswordInput = event => this.setState({ password: event.target.value })
    handleFormSubmit = event => {
        event.preventDefault();
        const { state: { email, password }, props: { onLogin } } = this;
        onLogin(email, password)

    }

    handleForButton = event => {
        event.preventDefault();
        const { props: { goToRegister } } = this
        goToRegister();
    }





    render() {

        const { handleEmailInput, handlePasswordInput, handleFormSubmit, handleForButton, props: { feedback } } = this

        return <section className='login'>
            <h2>Login</h2>
            <form className='login-form' onSubmit={handleFormSubmit}>
                <label>Email</label>
                <input className='login-form__input' type="email" onChange={handleEmailInput} />
                <label>Password</label>
                <input className='login-form__input' type="passsword" onChange={handlePasswordInput} />
                <button className='login-form__button'>Login</button>
            </form>

            <button className='login__register-button' onClick={handleForButton}>Register</button>

            {feedback && <Feedback message={feedback} level='warn' />}


        </section>


    }


}

class RegisterPanel extends React.Component {

    state = {

        email: '',
        password: '',
        name: '',
        surname: '',
        confirmPassword: ''

    }

    handleEmailInput = event => this.setState({ email: event.target.value })
    handlePasswordInput = event => this.setState({ password: event.target.value })
    handleConfirmPasswordInput = event => this.setState({ confirmPassword: event.target.value })
    handleNameInput = event => this.setState({ name: event.target.value })
    handleSurnameInput = event => this.setState({ surname: event.target.value })
    handleFormSubmit = event => {
        event.preventDefault();
        const { state: { name, surname, email, password, confirmPassword }, props: { onRegister } } = this;
        onRegister(name, surname, email, password, confirmPassword)

    }

    handleForButton = event => {
        event.preventDefault();
        const { props: { goToLogin } } = this
        goToLogin();
    }


    render() {

        const { handleEmailInput, handlePasswordInput, handleConfirmPasswordInput, handleNameInput, handleSurnameInput, handleFormSubmit, handleForButton, props: { feedback } } = this

        return <section className='register'>
            <h2>Register</h2>

            <form className='register-form' onSubmit={handleFormSubmit}>
                <label>Name</label>
                <input className='register-form__input' type="text" onChange={handleNameInput} />
                <label>surname</label>
                <input className='register-form__input' type="text" onChange={handleSurnameInput} />
                <label>Email</label>
                <input className='register-form__input' type="email" onChange={handleEmailInput} />
                <label>Password</label>
                <input className='register-form__input' type="password" onChange={handlePasswordInput} />
                <label>confirmPassword</label>
                <input className='register-form__input' type="password" onChange={handleConfirmPasswordInput} />
                <button className='register-form__button'>Register</button>
            </form>


            <button className='register__login-button' onClick={handleForButton}>LogIn</button>
            {feedback && <Feedback message={feedback} level='warn' />}


        </section>


    }

}

class SearchPanel extends React.Component {
    state =
        {

            query: ''


        }

    handleQuery = event => this.setState({ query: event.target.value })

    handleFormSubmit = event => {
        event.preventDefault();
        const { state: { query }, props: { onSearch } } = this;
        onSearch(query)

    }

    handleForButton = event => {
        event.preventDefault();
        const { props: { goToLogout } } = this
        goToLogout();
    }
    handleForButtonClear = event => {
        event.preventDefault();
        const { props: { onClear } } = this
        onClear();
    }

    render() {

        const { handleQuery, handleFormSubmit, handleForButton, handleForButtonClear, props: { feedback } } = this

        return <section className="search">

            <button className='search__button-logout' onClick={handleForButton}>Logout</button>

            <h2 className='search__title'>Search an Artist</h2>


            <form className='search-form' onSubmit={handleFormSubmit}>
                <input className="search-form__input" placeholder="Search an artist" type="text" name="query" onChange={handleQuery}></input>
                <div className='search-form-buttons'>
                    <button className='search-form-buttons__button'>Search</button>
                    <button className='search-form-buttons__button' onClick={handleForButtonClear}>Clear Results</button>

                </div>

            </form>


            {feedback && <Feedback message={feedback} level='warn' />}

        </section>

    }


}

class ArtistsPanel extends React.Component {



    onArtistSelected = (id) => {



        const { props: { onArtistSelect } } = this

        onArtistSelect(id)


    }




    render() {



        const { props: { artistList }, onArtistSelected } = this
        return <section className='artists'>
            <h2 className='artists__title'>Artists</h2>
            <div className='artists-items' >
                {artistList.map(({ id, images, name }) => {
                    return <div className='artists-items-item' id-data={id} onClick={() => onArtistSelected(id)} >
                        <img className='artists-items-item__image' src={images[0] ? images[0].url : 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png'} alt="" />
                        <h4 className='artists-items-item__name'>{name}</h4>
                    </div>
                })}
            </div>
        </section>
    }
}


class AlbumsPanel extends React.Component {


    onAlbumSelected = (id) => {



        const { props: { onAlbumSelect } } = this

        onAlbumSelect(id)


    }

    handleForButton = event => {
        event.preventDefault();
        const { props: { goToArtists } } = this
        goToArtists();
    }

    render() {



        const { props: { albumList }, onAlbumSelected, handleForButton } = this
        return <section className='albums'>
            <button className='albums__button' onClick={handleForButton}>Back</button>
            <h2 className='albums__title'>Albums</h2>
            <div className='albums-items'>
                {albumList.map(({ id, images, name }) => {
                    return <div className='albums-items-item' id-data={id} onClick={() => onAlbumSelected(id)} >
                        <img className='albums-items-item__image' src={images[0] ? images[0].url : 'https://developer.spotify.com/assets/branding-guidelines/icon3@2x.png'} alt="" />
                        <h4 className='albums-items-item__name'>{name}</h4>
                    </div>
                })}
            </div>
        </section>
    }

}

class TrackListPanel extends React.Component {


    onTrackSelected = (id) => {



        const { props: { onTrackSelect } } = this

        onTrackSelect(id)


    }
    handleForButton = event => {
        event.preventDefault();
        const { props: { goToAlbums } } = this
        goToAlbums();
    }

    render() {



        const { props: { trackList }, onTrackSelected, handleForButton } = this
        return <section className='tracklist'>
            <button className='tracklist-button' onClick={handleForButton}>Back</button>
            <h2 className='tracklist-title'>Tracks</h2>
            <div className='tracklist-tracklist'>
                {trackList.map(({ id, name }) => {
                    return <div className='tracklist-tracklist-item' id-data={id} onClick={() => onTrackSelected(id)} >
                        <h4 className='tracklist-tracklist-item__item' >{name}</h4>
                    </div>
                })}
            </div>
        </section>
    }

}


class TrackPanel extends React.Component {



    render() {
        const { props: { track } } = this
        return <section className='playingTrack'>

            <div>

                <h4>{track.name}</h4>
                <audio controls autoPlay src={track.preview_url}></audio>

            </div>




        </section>








    }




}




ReactDOM.render(<App />, document.getElementById('root'))   
