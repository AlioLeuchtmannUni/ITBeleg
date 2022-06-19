# ITBeleg

s82067
Alio Leuchtmann
Allgemeine Informatik

Notizen zum Starten der Anwendung:

Ich habe mein eigenes Backend geschrieben.
Starten des Backends:
1. In src Ordner bewegen wo die mvnw datei liegt
2. Ausführen von ./mvnw package
3. cd ./target
4. cp quizBackend-0.0.1-SNAPSHOT.jar ./..
5. cd ..
6. java -jar quizBackend-0.0.1-SNAPSHOT.jar
7. Nun sollte das Backend auf localhost port 8080 laufen

Die jar muss im selben Ordner ausgeführt werden in dem auch der assets Ordner liegt.
Wenn das Backend nicht über "http://127.0.0.1:8080/" erreichbar ist muss die baseUrl in script.js geändert werden.

Ich kann die Anwendung leider nicht auf dem Webserver der HTW ausführen da ich keine Möglichkeit finde
localhost:8080 von dort aus zu erreichen.
Die Webseite der HTW leitet die Anfragen immer um so das sie das Backend nicht erreichen.
Also muss die Anwendung wahrscheinlich bei ihnen lokal getestet werden, ich hoffe das ist kein Problem.

Notizen zum Beleg:

Backend Funktionalität:

Man kann alle Fragen anfragen
Alle, N oder genau eine einer Kategorie.
Darüber hinaus kann mann auch neue Fragen hinzufügen.

Es werden dabei als Objekte Json Strings verwendet so wie sie in der Aufgabenstellung gegeben waren.
Bis auf den addQuestion Enpunkt hier werden die daten über Pfadvariablen in der Url übergeben

/addQuestion/{category}/{question}/{solution}/{alt1}/{alt2}/{alt3}


Frontend Funktionalität:

Beim Start der Anwendung werden aktuell alle Fragen vom Backend geholt.
Ab diesem Punkt kann die Internetverbindung auch abrechen, und die Anwendung bleibt weiterhin nutzbar bis auf die 
add Question Funktionalität die natürlich mit dem Backend Kommunizieren muss um die Frage zu speichern.

Bei jedem Durchgang werden bis zu 10 zufällige Fragen ausgewählt wenn 10 verfügbar sind.
Nach beenden des Durchgangs gibt es eine Rückmeldung wie viele Antworten richtig waren.
Man kann darüber hinaus unter Fortschritt seine Historie begutachten wie oft man welche Fragen aus welcher Kategorie
richtig und oder Falsch hatte. Diese Daten werden nur für die Session gespeichert.

Wenn man die Seite verlässt und dann zurück kehrt sind diese nicht mehr vorhanden

Die funktionalität zum Dynamischen nachladen ist vorhanden: oben genannte Endpunkte des Backends.
Aber ich habe mich Anfangs entschieden alles zu laden und es dann dabei belassen. 
Zumindest kann man erkennen das ich weiß wie eine solche Anfrage aussieht.


    
    
