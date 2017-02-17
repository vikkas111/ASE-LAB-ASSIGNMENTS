package com.example.nikky.texttospeech;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.content.Intent;
import android.widget.EditText;

public class loginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }

    public void onButtonClick(View v)
    {
if(v.getId()==R.id.Blogin)
{
    EditText a=(EditText)findViewById(R.id.TFusername);
    String str =a.getText().toString();

Intent i=new Intent (loginActivity.this,Display.class);
    i.putExtra("Username",str);

    startActivity(i);
}
    }
}
