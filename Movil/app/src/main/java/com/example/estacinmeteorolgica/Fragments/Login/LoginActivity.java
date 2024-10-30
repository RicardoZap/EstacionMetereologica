package com.example.estacinmeteorolgica.Fragments.Login;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.example.estacinmeteorolgica.R;

public class LoginActivity extends AppCompatActivity {

    LoginFragment lf = new LoginFragment();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        getSupportFragmentManager().beginTransaction().add(R.id.space_login, lf).commit();
    }
}