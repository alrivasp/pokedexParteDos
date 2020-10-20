$(function () {
    //Inicio Linea de ejecucion
        //Animaciones
        setTimeout(() => {
            $('.loader').fadeOut('slow');
            $('.contenido').fadeIn('slow')
            $(".navbarPokemon").animate({ width: '100%' }, "slow");
        }, 7000);
        setTimeout(() => {
            $(".content-principal").fadeIn('slow');
            $(".spinner").show('slow');
        }, 8000);
        setTimeout(() => {
            $(".spinner").hide('fast');
        }, 11000);
        setTimeout(() => {
            $(".pokemon-card").show('slow');
        }, 12000);
        setTimeout(() => {
            $("#more-pokemon").show('slow');
        }, 13000);

        //Captura de url de api
        var urlBase = 'https://pokeapi.co/api/v2/pokemon/'
        //Pasar url a funcion pokemon
        getPokemones(urlBase);
    //Fin Linea de ejecucion

    //Inicio Eventos
        //Evento Normal
        $("#more-pokemon").click(() => {
            var url = $('#more-pokemon').attr('data-nexturl');
            getPokemones(url)
        });

        //Evento de Bubujeo
        $('.pokemon-card').click((event) => {
            if (event.target.dataset.pokemon) {
                var pokemon_name = event.target.dataset.pokemon
                $('#pokemonModalLabel').html(pokemon_name.toUpperCase())
                getDataPokemon(pokemon_name, urlBase);
            }
        });

        $('.pokemon-types').click((event) => {
            if (event.target.dataset.type) {
                var url = event.target.dataset.type
                getDamage(url)
            }
        });

        $('.pokemon-abilities').click((event) => {
            if (event.target.dataset.ability) {
                var url = event.target.dataset.ability
                otherPokemonsWithAbility(url)
            }
        });
    //Fin Eventos

    //Inicio Funciones
        //Funcion Gestion de Daños
        function getDamage(url) {
            limpiaModalDanio()
            fetch(url)
                .then((data_results)=>{
                    return data_results.json()
                })
                .then((data)=>{
                    var double_damage_from = data.damage_relations.double_damage_from
                    for (let i = 0; i < double_damage_from.length; i++) {
                        var li = $(document.createElement('li')).html(double_damage_from[i].name)
                        $('#double_damage_from').append(li)
                    }

                    var double_damage_to = data.damage_relations.double_damage_to
                    for (let i = 0; i < double_damage_to.length; i++) {
                        var li = $(document.createElement('li')).html(double_damage_to[i].name)
                        $('#double_damage_to').append(li)
                    }

                    var half_damage_from = data.damage_relations.half_damage_from
                    for (let i = 0; i < half_damage_from.length; i++) {
                        var li = $(document.createElement('li')).html(half_damage_from[i].name)
                        $('#half_damage_from').append(li)
                    }

                    var half_damage_to = data.damage_relations.half_damage_to
                    for (let i = 0; i < half_damage_to.length; i++) {
                        var li = $(document.createElement('li')).html(half_damage_to[i].name)
                        $('#half_damage_to').append(li)
                    }

                    var no_damage_from = data.damage_relations.no_damage_from
                    for (let i = 0; i < no_damage_from.length; i++) {
                        var li = $(document.createElement('li')).html(no_damage_from[i].name)
                        $('#no_damage_from').append(li)
                    }

                    var no_damage_to = data.damage_relations.no_damage_to
                    for (let i = 0; i < no_damage_to.length; i++) {
                        var li = $(document.createElement('li')).html(no_damage_to[i].name)
                        $('#no_damage_to').append(li)
                    }
                })

                $('#pokemonDanioModal').modal('show')
        };

        //Funcion Otros pkemon con la habilidad
        function otherPokemonsWithAbility(url) {
            limpiaModalAbility()
            fetch(url)
                .then((data_results)=>{
                    return data_results.json()
                })
                .then((data)=>{
                    var pokemones = data.pokemon
                    for (let i = 0; i < pokemones.length; i++) {
                        var li = $(document.createElement('li')).html(pokemones[i].pokemon.name)
                        $('#abilityPokemon').append(li)
                    }
                })

                $('#pokemonHabilityModal').modal('show')
        };

        //funcion Pokemon
        function getPokemones(url) {
            fetch(url)
                .then((data_result)=>{
                    return data_result.json();
                })
                .then((data)=>{
                    addPokemon(data);
                    $('#more-pokemon').attr('data-nexturl', data.next)
                })
        };

        //Funcion Agrega Pokemon
        function addPokemon(data) {
            var pokemones = data.results;
            for (let i = 0; i < pokemones.length; i++) {
                fetch(pokemones[i].url)
                    .then((data_result)=>{
                        return data_result.json()
                    })
                    .then((data)=>{
                        createCard(data);
                    })
            };
        };

        //funcion que crea tarjeta
        function createCard(data) {
            var col = $(document.createElement('div')).attr('class', 'col')
            var card = '<div class="card shadow p-3 mb-5 rounded" style="width: 15rem;">' +
                '<span class="circulo"></span>' +
                '<img src="' + data.sprites.other.dream_world.front_default + '" class="card-img-top text-center bg-card-img p-2" alt="' + data.name + '">' +
                '<div class="card-body text-center">' +
                '<h5 class="card-title">' + data.name.toUpperCase() + '</h5>' +
                '<a href="#" class="btn-modal-pokemon btn btn-success rounded-pill btn-card shadow p-3" data-pokemon="' + data.name + '" data-toggle="modal" data-target="#pokemonModal" >¡Quiero saber más de este pokémon!</a>' +
                '</div>' +
                '</div>'

            col.append(card);
            $('.rowPokemon').append(col);
        }

        //Funcion que obtiene y agrega informaciondel pokemon
        function getDataPokemon(name,url) {
            limpiarModal()
            //consumo de api 
            fetch(url + name)
                .then((data_result) => {
                    return data_result.json()
                })
                .then((data) => {
                    //agregar foto
                    $('.img-modal').attr('src', data.sprites.other.dream_world.front_default);
                    //agregar habilidades
                    data.abilities.forEach(element => {
                        var habilidad = $(document.createElement('li')).html(element.ability.name)
                        var boton = $(document.createElement('button')).html('Otros Pokemones que tienen esta Habilidad').attr('class', "btn btn-danger btn-sm m-1").attr('data-ability', element.ability.url)
                        $('.pokemon-abilities').append(habilidad)
                        $('.pokemon-abilities').append(boton)
                    });
                    //agregar tipos
                    data.types.forEach(element => {
                        var tipos = $(document.createElement('li')).append(element.type.name)
                        var boton = $(document.createElement('button')).html('Ver Realacion de Daños').attr('class', "btn btn-primary btn-sm m-1").attr('data-type', element.type.url)
                        $('.pokemon-types').append(tipos)
                        $('.pokemon-types').append(boton)
                    });
                    //agregar movimiento
                    var aux= 0;
                    data.moves.forEach(element => {
                        aux += 1
                        if (aux < 6) {
                            var movimiento = $(document.createElement('li')).html(element.move.name)
                            $('.pokemon-move').append(movimiento)
                        }
                    });
                });
        }

        //Funcion que limpia modal 
        function limpiarModal() {
            //limpiar modal principal
            $('.img-modal').attr('src', "");
            $(".pokemon-types").html("");
            $(".pokemon-abilities").html("");
            $(".pokemon-move").html("");
        }

        function limpiaModalAbility() {
            //limpiar modal Habilidad
            $("#abilityPokemon").html("");
        }

        function limpiaModalDanio() {
           //limpiar modal Daño
           $("#double_damage_from").html("");
           $("#double_damage_to").html("");
           $("#half_damage_from").html("");
           $("#half_damage_to").html("");
           $("#no_damage_from").html("");
           $("#no_damage_to").html("");
        }

    //Fin Funciones
});
