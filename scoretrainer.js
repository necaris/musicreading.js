/*  Musical Score Reading Trainer

    Copyright (C) 2010 Rami Chowdhury (http://necaris.net)
    Inspired by and based in concept on work by J Pablo Fernandez (http://www.pupeno.com).
    Graphics modified from those obtained from Wikipedia (http://www.wikipedia.org).
    Provided under the terms of the GNU General Public License, version 2.
*/

function ScoreTrainer(config)
{
    var self = this;

    self.mountpoint = config['mountpoint'];

    self.notes = new Array();
    self.note_count = config["note_count"];
    self.clef = config["clef"];
    self.note_separation = config["note_distance"];

    self.note_map = null;
    self.note_map_bass = new Array('D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F');
    self.note_map_treb = new Array('B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D');

    /**
     * Set up the work area -- bind document elements, attach listeners, etc.
     * Also set the active clef and generate the initial set of notes to get
     * things going.
     */
    self.init = function() {

        self.score_box = document.getElementById("score_box");

        self.clef_box = document.getElementById("clef_box");
        self.clef_img = document.getElementById("clef_img");
        self.clef_radio_bass = document.getElementById("clef_bass");
        self.clef_radio_bass.onchange = self.intercept_clef;
        self.clef_radio_treb = document.getElementById("clef_treb");
        self.clef_radio_treb.onchange = self.intercept_clef;
        self.set_clef(self.clef);


        self.note_buttons = {};
        var i = 0; var possible_notes = new Array('C', 'D', 'E', 'F', 'G', 'A', 'B'); var ltr = null;
        for (i = 0; i < 7; i++) {
            ltr = possible_notes[i];
            self.note_buttons[ltr] = document.getElementById("note_" + ltr);
            self.note_buttons[ltr].onclick = self.intercept_clicks;
        }

        document.onkeyup = self.intercept_keys;

        self.reset_notes();
    };

    /**
     * Set the active clef and change the note map accordingly.
     */
    self.set_clef = function(clef) {
        self.clef_radio_bass.removeAttribute("selected");
        self.clef_radio_treb.removeAttribute("selected");
        switch(clef) {
            case "bass":
                self.clef = "bass";
                self.clef_img.src = self.mountpoint + "bass_clef.png";
                self.note_map = self.note_map_bass;
                self.reset_notes();
                self.clef_radio_bass.setAttribute("selected", "selected");
                break;
            case "treb":
                self.clef = "treb";
                self.clef_img.src = self.mountpoint + "treb_clef.png";
                self.note_map = self.note_map_treb;
                self.reset_notes();
                self.clef_radio_treb.setAttribute("selected", "selected");
                break;
            default:
                self.clef = "treb";
                self.clef_img.src = self.mountpoint + "treb_clef.png";
                self.note_map = self.note_map_treb;
                self.reset_notes();
                self.clef_radio_treb.setAttribute("selected", "selected");
                break;
        }

    };

    /**
     * Regenerate the notes visible / active on screen.
     */
    self.reset_notes = function() {
        self.ctr = 0;
        var i = 0; var length_ = self.notes.length;
        for (i = 0; i < length_; i++) {
            self.pop_note();
        }

        for (i = 0; i < self.note_count; i++) {
            self.push_random_note();
        }
    };

    /**
     * Internal method -- adds a note on the right side of the score.
     */
    self.push_random_note = function() {
        var rand = self.get_random_note();
        var note = document.createElement("img");
        note.setAttribute("class", "note");
        if (rand > 7) {
            note.src = self.mountpoint + "qnote_down.png";
            // Number of steps from top, 15px per step, -8 for lobe height
            note.style.top = (((15 - rand) * 15) + 2) + "px";
        } else {
            note.src = self.mountpoint + "qnote_up.png";
            // Steps from top, 15px per step, -100 for stem + lobe height
            note.style.top = (((15 - rand) * 15) - 85) + "px";
        }

        if (self.notes.length > 0) {
            var last = self.notes[self.notes.length - 1][0];
            var last_lft = parseInt(last.style.left.substr(0, last.style.left.length - 2));
        } else {
            var last_lft = 100;
        }
        note.style.left = (last_lft + self.note_separation) + "px";

        // if it's high or low enough, it may need a background bar
        switch(rand) {
            case 0:
                note.style.paddingLeft = "8px";
                note.style.paddingRight = "8px";
                note.style.background = "transparent url('" + self.mountpoint + "bg_line.png') repeat-x 50% 76%";
                break;
            case 1:
                note.style.paddingLeft = "8px";
                note.style.paddingRight = "8px";
                note.style.background = "transparent url('" + self.mountpoint + "bg_line.png') repeat-x 50% 89%";
                break;
            case 13:
                note.style.paddingLeft = "8px";
                note.style.paddingRight = "8px";
                note.style.background = "transparent url('" + self.mountpoint + "bg_line.png') repeat-x 50% 14%";
                break;
            case 14:
                note.style.paddingLeft = "8px";
                note.style.paddingRight = "8px";
                note.style.background = "transparent url('" + self.mountpoint + "bg_line.png') repeat-x 50% 26%";
                break;
            case 15:
                note.style.paddingLeft = "8px";
                note.style.paddingRight = "8px";
                note.style.background = "transparent url('" + self.mountpoint + "bg_line.png') repeat-x 50% 35%";
                break;
        }
        note.alt = self.note_map[rand];

        self.notes.push(new Array(note, rand, self.note_map[rand]));
        self.score_box.appendChild(note);
    };

    /**
     * Internal method -- remove a note from the left of the score.
     */
    self.pop_note = function() {
        var note = self.notes.shift();
        self.score_box.removeChild(note[0]);
    };


    /**
     * Internal method -- slide each note in the score to the left by
     * `config.note_separation` pixels.
     */
    self.move_notes = function() {
        var i = 0; var note = null; var note_lft = null;
        for (i = 0; i < self.notes.length; i++) {
            note = self.notes[i][0]; // remember, self.notes is an array of 3-tuples
            note_lft = parseInt(note.style.left.substr(0, note.style.left.length - 2));
            note.style.left = (note_lft - self.note_separation) + "px";
        }
    };

    /**
     * Internal method -- pick a random "note" from the available range.
     */
    self.get_random_note = function() {
        return Math.floor(Math.random() * 16); // 16 notes in the map
    };

    /**
     * Listener function -- when the user presses a key, check to see
     * if it corresponds to the note currently under inspection.
     */
    self.intercept_keys = function(e) {
        var keycode = (window.event) ? event.keyCode : e.keyCode ;
        if (e.keyCode < 65 || e.keyCode > 71) {
            return;
        }
        // alert(String.fromCharCode(keycode));
        self.check_answer(String.fromCharCode(keycode).toUpperCase());
    };

    /**
     * Listener function -- when the user clicks an answer button, check to
     * see if it's the right answer.
     */
    self.intercept_clicks = function(e) {
        // alert(e.target.value);
        self.check_answer(e.target.value);
    };

    /**
     * Listener function -- when the user chooses a different clef, set it.
     */
    self.intercept_clef = function(e) {
        // alert(e.target);
        self.set_clef(e.target.value);
    };

    /**
     * Internal method -- check that a given answer corresponds to the note
     * currently under inspection. If it is, remove it from display and slide
     * the notes along; if it isn't, color the incorrect answer in red.
     */
    self.check_answer = function(ans) {
        var is_correct = (self.notes[0][2] == ans);
        // alert(is_correct + ", " + self.notes[0][2] + " == " + ans);
        if (!is_correct) {
            self.note_buttons[ans].style.backgroundColor = "#FBB";
            return;
        } else {
            self.note_buttons[ans].style.backgroundColor = "#BFB";
            self.pop_note();
            self.move_notes();
            self.push_random_note();

            var i = 0; var possible_notes = new Array('C', 'D', 'E', 'F', 'G', 'A', 'B'); var ltr = null;
            for (i = 0; i < 7; i++) {
                ltr = possible_notes[i];
                self.note_buttons[ltr].style.backgroundColor = "#DDD";
            }
        }
    };
};

