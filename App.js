import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Die 4 Grundlagen des NEST-Prinzips
const NEST_STEPS = [
  { key: 'N', label: 'Nutrition', question: 'Wie gut isst du zurzeit?\n(Auf einer Skala 1-10)' },
  { key: 'E', label: 'Exercise', question: 'Wie war dein Training?\n(Auf einer Skala 1-10)' },
  { key: 'S', label: 'Sleep', question: 'Wie erholsam ist dein Schlaf?\n(Auf einer Skala 1-10)' },
  { key: 'T', label: 'Toxins', question: 'Wie frei ist dein Körper von Toxinen?\n(10 = gar keine, 1 = jeden Tag)' },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ N: 5, E: 5, S: 5, T: 5 }); // Standard-Scores setzen
  const [goals, setGoals] = useState({});
  const [finished, setFinished] = useState(false);

  // Score aktualisieren
  const handleScoreChange = (key, value) => {
    setScores({ ...scores, [key]: value });
  };

  // Nächsten Schritt oder Zusammenfassung anzeigen
  const nextStep = () => {
    // Hier könnte man später die Zieleingabe pro Punkt (+1) integrieren
    if (currentStep < NEST_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
    }
  };

  // Fortschritt oben berechnen (0.1 bis 0.5)
  const progressPercent = (currentStep + 1) / NEST_STEPS.length;

  if (finished) {
    // Zusammenfassungs-Screen
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Progress Bar (Full) */}
        <View style={styles.progressHeader}>
          <View style={[styles.progressBar, { width: width * 0.5 }]} />
          <View style={[styles.progressDot, { left: width * 0.5 }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.summaryTitle}>Dein NEST Plan 🚀</Text>
          {NEST_STEPS.map((step) => (
            <View key={step.key} style={styles.summaryCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{step.label}</Text>
                <Text style={styles.cardScore}>{scores[step.key]}/10</Text>
              </View>
              {/* Platzhalter für das Ziel (z.B. +1 Punkt) */}
              <Text style={styles.cardGoal}>Ziel für nächste Woche: +1 Punkt erreichen.</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => { setFinished(false); setCurrentStep(0); }}
        >
          <Text style={styles.continueText}>Neuer Check-in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Aktueller Check-in Screen
  const activeStep = NEST_STEPS[currentStep];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Fortschrittsbalken */}
      <View style={styles.progressHeader}>
        <View style={[styles.progressBar, { width: width * 0.1 }]} />
        <View style={[styles.progressBarActive, { width: width * 0.4 * progressPercent }]} />
        <View style={[styles.progressDot, { left: width * 0.1 + width * 0.4 * progressPercent }]} />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.mainQuestion}>{activeStep.question}</Text>
        
        <View style={styles.scoreRow}>
          <Text style={styles.bigScore}>{scores[activeStep.key]}</Text>
        </View>

        {/* NEST-Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={scores[activeStep.key]}
            onValueChange={(value) => handleScoreChange(activeStep.key, value)}
            minimumTrackTintColor="#FF7E21" // Orange
            maximumTrackTintColor="#D9D9D9" // Grau
            thumbTintColor="transparent" // Versteckt den Standard-Knopf
          />
          {/* Vertikaler Schieberegler (Strich) */}
          <View style={[styles.sliderLine, { left: `${(scores[activeStep.key] - 1) / 9 * 100}%` }]} />
          
          {/* Ticks/Punkte auf dem Slider */}
          <View style={styles.ticksContainer}>
            {[...Array(10)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.tickDot, 
                  i < scores[activeStep.key] ? styles.tickDotActive : styles.tickDotInactive
                ]} 
              />
            ))}
          </View>
          {/* Skala Beschriftung */}
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleText}>1</Text>
            <Text style={styles.scaleText}>10</Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={nextStep}>
        <Text style={styles.continueText}>{currentStep === 3 ? "Fertigstellen" : "Continue"}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styling im Stil der Screenshots
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60, // Platz für StatusBar
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 100, // Platz für Button unten
  },
  // Progress Bar Styles
  progressHeader: {
    height: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  progressBar: {
    backgroundColor: '#D9D9D9',
    height: '100%',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
  },
  progressBarActive: {
    backgroundColor: '#FF7E21',
    height: '100%',
    borderRadius: 3,
    position: 'absolute',
    left: width * 0.1, // Startet nach dem grauen Teil
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF7E21',
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  // Question Styles
  questionContainer: {
    alignItems: 'center',
    flex: 1,
  },
  mainQuestion: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000000',
    lineHeight: 32,
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  scoreRow: {
    marginBottom: 30,
  },
  bigScore: {
    fontSize: 64,
    fontWeight: '700',
    color: '#000000',
  },
  // NEST-Slider Styles
  sliderWrapper: {
    width: '100%',
    position: 'relative',
    height: 60, // Mehr Höhe für Ticks und Labels
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    transform: [{ scaleY: 2.5 }], // Slider-Leiste dicker machen
  },
  sliderLine: {
    width: 2,
    height: 30,
    backgroundColor: '#FF7E21',
    position: 'absolute',
    top: 5, // Mittig auf dem Slider
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15, // Abstand zum Rand
    position: 'absolute',
    top: 15, // Höhe der Punkte
  },
  tickDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tickDotActive: {
    backgroundColor: '#FF7E21',
  },
  tickDotInactive: {
    backgroundColor: '#D9D9D9',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: -10,
  },
  scaleText: {
    fontSize: 12,
    color: '#808080',
  },
  // Continue Button Styles
  continueButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF7E21',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  continueText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Summary Styles
  summaryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7E21',
  },
  cardScore: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  cardGoal: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});