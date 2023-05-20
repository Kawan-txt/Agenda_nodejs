// config
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Model de usuario
require('../models/usuario')
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) =>{

        Usuario.findOne({email: email}).then((usuario) =>{
            if(!usuario){
                return done(null,false, {message: "Conta Inexistente"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) =>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null,false, {message: "Senha Incorreta"})
                }
            })
        })
    }))


    passport.serializeUser((usuario, done) =>{

        done(null, usuario.id)

    })

    passport.deserializeUser((id, done) =>{
        Usuario.findById(id).then((usuario) =>{
            done(null, usuario)
        }).catch((erro) =>{
            done(null,false, {message: "Erro Interno"})
        })
    })
}